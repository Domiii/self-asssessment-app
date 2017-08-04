import _ from 'lodash';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';

import autoBind from 'auto-bind';

import { pathJoin } from 'src/util/pathUtil';
//import { createSelector } from 'reselect';

import { helpers, getFirebase } from 'react-redux-firebase';
import { EmptyObject } from 'src/util';
import Immutable from 'immutable';


import { makeIndices } from './indices';
import { 
  createPathGetterFromTemplate,
  createPathGetterFromTemplateProps,
  createPathGetterFromTemplateArray,
  parseTemplateString
} from './dataUtil';
import {
  createDataAccessors
} from './dataAccess';

const { 
  pathToJS, isLoaded, isEmpty, dataToJS, 
  populatedDataToJS
} = helpers;

const defaultConfig = {
  pushedAt(val) {
    val.updatedAt = getFirebase().database.ServerValue.TIMESTAMP;
  },
  updatedAt(val) {
    val.updatedAt = getFirebase().database.ServerValue.TIMESTAMP;
  }
};

function makeUpdatedAt(propName) {
  return function updatedAt(val) {
    val[propName] = getFirebase().database.ServerValue.TIMESTAMP;
  };
}

// this "cache" is a first attempt at 
//    minimizing react re-render calls by
//    always returning the same instance at a given path
const dataCache = {};

function _cachePut(path, args, data) {
  let entry = dataCache[path];
  if (!entry) {
    entry = {};
  }
  entry.args = args;
  entry.data = data;
}

function _cacheGet(path, args) {
  const entry = dataCache[path];
  if (entry && isEqual(args, entry.args)) {
    return entry.data;
  }
  return null;
}

function _cacheLookup(path, args, newData) {
  const oldData = _cacheGet(path, args);

  if (!isEqual(newData, oldData)) {
    // update cache
    _cachePut(path, args, newData);
    return newData;
  }
  return oldData;
}

function _cachedFetchPopulate(firebaseDataRoot, path, queryArgs) {
  const newData = populatedDataToJS(firebaseDataRoot, path, queryArgs.populates);
  return _cacheLookup(path, queryArgs, newData);
}

function _cachedFetchPlain(firebaseDataRoot, path) {
  const newData = dataToJS(firebaseDataRoot, path);
  return _cacheLookup(path, null, newData);
}

// return function to get data at given path 
// from current state in store
function makeGetDataDefault(firebaseDataRoot, path, queryArgs) {
  if (_.isPlainObject(queryArgs) && queryArgs.populates) {
    return () => _cachedFetchPopulate(firebaseDataRoot, path, queryArgs);
  }
  return () => _cachedFetchPlain(firebaseDataRoot, path);
};

/**
 * Provide path, relative to parent (root) path, given user-provided props object.
 * MUST be provided for all children. OPTIONAL in root.
 * @callback makeRefWrapper~getPathFunc
 * @param {object} props
 */

/**
 * Wrap data access to a specific path in your Firebase DB (and it's child paths).
 * NOTE that the `redux-react-firebase` module internally already takes care of
 *    dispatching actions for firebase operations and reducing firebase data.
 * 
 * @param {object|string} cfgOrPath.pathTemplate|cfgOrPath The path of the given ref wrapper.
 * @param {object} [cfgOrPath.children] Children wrappers within the same rootPath.
 * @param {object} [cfgOrPath.methods] Custom set of methods (selectors/actions) for this specific data set.
 * @param {object} [cfgOrPath.inheritedMethods] These methods will be assigned to self and all children.
 * @param {object} [cfgOrPath.cascadingMethods] These methods will be assigned to self and all parents, but parameters will be filled from props, according to all variables in full path.
 * 
 * returns a new ref wrapper function (firebaseDataRoot, props) with the following properties:
 *  parent, getPath, and all corresponding child wrapper functions
 *
 * TODO: Use reselect + internal caching so we can reduce re-creation of wrappers
 */
export function makeRefWrapper(cfgOrPath) {
  return _makeRefWrapper(null, defaultConfig, cfgOrPath);
}

export function addChildrenToRefWrapper(parent, children, inheritedSettings, cascadingMethods) {
  inheritedSettings = inheritedSettings || defaultConfig;
  for (let wrapperName in children) {
      const childCfg = children[wrapperName];

      WrapperClass._ChildWrappers = parent[wrapperName] = 
        _makeRefWrapper(parent, inheritedSettings, childCfg);

      if (cascadingMethods && childCfg.cascadingMethods) {
        // add all descendant cascading methods as well
        Object.assign(cascadingMethods, childCfg.cascadingMethods);
      }
    }
}

// TODO: currently unused
function logDBAction(pathTemplate, actionName, args) {
  try {
    if (_.isObject(args) && _.has(args, 'updatedAt')) {
      // TODO: hack-around to get rid of firebase TIMESTAMP placeholder
      args = _.omitBy(args, (v, k) => k === 'updatedAt');
    }
    const argsString = JSON.stringify(args);
    console.debug(`[LOG] Action: ${actionName}("${pathTemplate}", ${argsString})`);
  }
  catch (err) {
    console.error(`Failed to log action: "${actionName}" at "${pathTemplate}"`);
    console.error(err.stack);
  }
}

// function logWrapper(pathTemplate, actionName, fn) {
//   return function logWrapped(...args) {
//     logDBAction(pathTemplate, actionName, args);
//     return fn.apply(this, args);
//   };
// }

// function logDecoratePrototype(pathTemplate, proto) {
//   for (const prop in proto) {
//     const val = proto[prop];

//     if (_.isFunction(val)) {
//       proto[prop] = logWrapper(pathTemplate, prop, val);
//     }
//   }
// }


function _buildQueryFinal(path, args) {
  if (!args) {
    return path;
  }
  else if (_.isString(args)) {
    return `${path}#${args}`;
  }
  else if (isArray(args)) {
    return ({
      path,
      queryParams: args
    });
  }
  else if (_.isPlainObject(args)) {
    return ({
      path,
      ...args
    });
  }
  else {
    throw new Error('Invalid query arguments: ' + JSON.stringify(args));
  }
}

// returns a function which converts query objects 
//    into propriotory `redux-react-firebase` query syntax
// see: https://github.com/tiberiuc/redux-react-firebase/blob/master/API.md#examples
function _makeMakeQuery(getPath, queryString) {
  let queryArgsFunc = queryString instanceof Function && queryString;
  let queryArgsConst = !(queryString instanceof Function) && queryString;
  let getQueryArgs = (...allArgs) => {
    let res = queryArgsFunc && queryArgsFunc.apply(this, allArgs) || queryArgsConst;
    return res;
  };

  function _defaultMakeQueryWithVariables(pathArgs, ...customArgs) {
    const path = getPath(pathArgs);
    const queryArgs = getQueryArgs.call(this, ...customArgs, ...pathArgs);
    return _buildQueryFinal(path, queryArgs);
  }

  function _defaultMakeQueryNoVariables(...customArgs) {
    const path = getPath();
    const queryArgs = getQueryArgs.call(this, ...customArgs);
    return _buildQueryFinal(path, queryArgs);
  }

  return getPath.hasVariables && 
    _defaultMakeQueryWithVariables || 
    _defaultMakeQueryNoVariables;
}

function _makeRefWrapper(parent, inheritedSettings, cfgOrPath) {
  let cfg;
  if (_.isString(cfgOrPath)) {
    cfg = { pathTemplate: cfgOrPath };
  }
  else {
    cfg = cfgOrPath;
  }
  console.assert(!!cfg, 'config was not provided under: ' + (parent && parent.pathTemplate));

  inheritedSettings = Object.assign({}, inheritedSettings, cfg);

  // some configuration parameters only affect the current config node
  let { 
    pathTemplate, children,
    // static, // cannot get static here because it's a reserved keyword
    methods, inheritedMethods, cascadingMethods
  } = cfg;

  // some configuration parameters are inherited down the chain
  let { 
    indices,
    updatedAt,
    queryString,
    makeQuery
  } = inheritedSettings;

  pathTemplate = parent && 
    pathJoin(parent.pathTemplate, pathTemplate) || 
    pathTemplate;

  indices = makeIndices(indices || {});

  const variableTransform = indices.encodeQueryValue.bind(indices);
  const getPath = createPathGetterFromTemplateProps(pathTemplate, variableTransform);
  const WrapperClass = createRefWrapperBase();

  // create the factory function
  const func = createWrapperFunc(parent, WrapperClass, getPath);
  if (cfg.static) {
    Object.assign(func, cfg.static);
  }
  func.parent = parent;
  func.getPath = getPath;
  func.pathTemplate = pathTemplate;
  func.inheritedMethods = inheritedMethods;
  func.indices = indices;
  func.makeQuery = (makeQuery || _makeMakeQuery.call(func, getPath, queryString)).bind(func);

  // recurse and add all children
  cascadingMethods = cascadingMethods || {};
  WrapperClass._ChildWrappers = {};
  if (children) {
    addChildrenToRefWrapper(func, children, inheritedSettings, cascadingMethods);
  }

  // work out indices
  WrapperClass.prototype.indices = indices;

  // add pushedAt + updatedAt to prototype
  // if (_.isFunction(inheritedSettings.pushedAt)) {
  //   WrapperClass.prototype._decoratePushedAt = inheritedSettings.pushedAt;
  // }
  if (_.isFunction(updatedAt)) {
    WrapperClass.prototype._decorateUpdatedAt = updatedAt;
  }
  else if (_.isString(updatedAt)) {
    WrapperClass.prototype._decorateUpdatedAt = makeUpdatedAt(updatedAt);
  }

  // add push,get,set,update,delete accessors
  createDataAccessors(WrapperClass.prototype, children, variableTransform);

  // add inheritedMethods
  inheritedMethods = inheritedMethods || {};
  if (parent && parent.inheritedMethods) {
    Object.assign(inheritedMethods, parent.inheritedMethods);
  }
  Object.assign(WrapperClass.prototype, inheritedMethods);

  // add cascadingMethods
  const varNames = parseTemplateString(pathTemplate).varNames;
  cascadingMethods = _.mapValues(cascadingMethods, function(method, name) {
    // replace path variables with props
    return function (...args2) {
      const props = this.props;
      const args1 = varNames.map(varName => props[varName]);
      return method.call(this, ...args1.concat(args2));
    };
  });
  Object.assign(WrapperClass.prototype, cascadingMethods);

  // add methods
  if (methods) {
    Object.assign(WrapperClass.prototype, methods);
  }

  // log all possible DB actions (that we are aware of)
  //logDecoratePrototype(pathTemplate, WrapperClass.prototype);

  return func;
}


// function getVariablesFromPath(path) {
//   const vars = [];
//   const re = /\$\(([^)]+)\)/g;
//   let match;
//   while ((match = re.exec(path || '')) != null) {
//     let varName = match[1];
//     vars.push(varName);
//   }

//   return vars;
// }


function createWrapperFunc(parent, WrapperClass, getPath) {
  const f = function wrapper(firebaseDataRoot, props, pathArgs, ...allQueryArgs) {
    pathArgs = pathArgs || props || EmptyObject;
    props = props || EmptyObject;
    
    let path = getPath(pathArgs);
    path = path.endsWith('/') ? path.substring(0, path.length-1) : path;

    //console.log('creating wrapper at: ' + path);
    const makeQuery = f.makeQuery;
    const queryArgs = allQueryArgs.length && makeQuery(...allQueryArgs) || null;
    const getData = makeGetDataDefault(firebaseDataRoot, path, queryArgs);

    const db = props.db || getFirebase().database();
    const ref = db.ref(path);
    const refWrapper = new WrapperClass();
    refWrapper.__init(parent, path, firebaseDataRoot, db, getData, ref, props);
    return refWrapper;
  };
  return f;
}

function createRefWrapperBase() {
  class RefWrapperBase {
    constructor() {
      autoBind(this);
    }

    __init(parent, path, firebaseDataRoot, db, getData, ref, props) {
      this.parent = parent;
      this.path = path;

      //this._clazz = clazz;
      this._firebaseDataRoot = firebaseDataRoot;
      this._db = db;
      //this._ref = ref;

      this._ref = ref;

      // getData(path) function returns data at given database path
      this._getData = getData;

      if (_.isFunction(this.updateProps)) {
        this.updateProps(props);
      }
      else {
        this.props = props;
      }
    }

    get val() {
      return this._getData();
    }

    get isLoaded() {
      return isLoaded(this.val);
    }

    findKey(filter) {
      return this.val && _.findKey(this.val, filter);
    }

    getDataIn(obj, path, defaultValue = null) {
      path = path.replace(/\//g, '.');    // lodash uses dot notation for path access
      return _.get(obj, path, defaultValue);
    }

    getData(path, defaultValue = null) {
      if (!path) {
        path = '';
      }
      // else if (path.startsWith('/')) {
      //   console.warn('invalid path: should not start with slash (/): ' + path);
      // }

      const obj = this._getData();
      if (!path) {
        return obj === undefined ? defaultValue : obj;
      }

      return this.getDataIn(obj, path, defaultValue);
    }

    getAllChildData(pathPrefix, idOrIds, defaultValue = null) {
      const ids = isArray(idOrIds) ? idOrIds : [idOrIds];

      const paths = ids.map(id => 
        pathJoin(pathPrefix, id)
      );

      return this.getAllData(paths, defaultValue);
    }

    getAllData(pathOrPaths, defaultValue = null) {
      const paths = isArray(pathOrPaths) ? 
        pathOrPaths : [pathOrPaths];

      const children = paths.map(path => 
        getData(path)
      );

      return children;
    }

    getRef(path) {
      // get firebase ref object at given path
      return path && this._ref.child(path) || this._ref;
    }

    onBeforeWrite(val) {
      return true;
    }

    onFinalizeWrite(val) {
      if (_.isObject(val) && this.indices) {
        this.indices.updateIndices(val);
      }
      return true;
    }

    onAfterWrite(actionName, val) {
      return this.onAfterWritePath(actionName, val, '');
    }

    onAfterWritePath(actionName, val, relPath) {
      //logDBAction(pathJoin(this.pathTemplate, relPath), actionName, val);
    }

    onPush(val) {
      if (_.isObject(val) && _.isFunction(this._decorateUpdatedAt)) {
        this._decorateUpdatedAt(val);
      }
      return true;
    }

    onUpdate(val) {
      if (_.isObject(val) && _.isFunction(this._decorateUpdatedAt)) {
        this._decorateUpdatedAt(val);
      }
      return true;
    }

    _onError(action, ref, err) {
      throw new Error(`${action} (at ${ref})\n${err.stack}`);
    }

    _doPush(ref, newChild) {
      try {
        const newRef = this.onBeforeWrite() && 
          this.onPush(newChild) &&
          this.onFinalizeWrite(newChild) &&
          ref.push(newChild);

        //newRef.then(() => this.onAfterWrite('push', newChild));
        return newRef;
      }
      catch (err) {
        this._onError('push', ref, err);
      }
    }

    push(newChild) {
      return this._doPush(this._ref, newChild);
    }

    pushChild(path, newChild) {
      // TODO: use proper decorators for descendant paths
      return this._doPush(this.getRef(path), newChild);
    }

    set(val) {
      const ref = this._ref;
      try {
        return (
          this.onBeforeWrite(val) &&
          this.onUpdate(val) &&
          this.onFinalizeWrite(val) &&
          ref.set(val)
          .then(() => this.onAfterWrite('set', this.val))
        );
      }
      catch (err) {
        this._onError('set', ref, err);
      }
    }

    setByIndex(indexData, childValue) {
      const key = this.indices.encodeQueryValue(indexData);
      return this.setChild(key, childValue);
    }

    setChild(path, childValue) {
      // TODO: use proper decorators for descendant paths
      const ref = this.getRef(path);
      try {
        return (
          this.onBeforeWrite(childValue) &&
          this.onUpdate(childValue) &&
          this.onFinalizeWrite(childValue) &&
          ref.set(childValue)
          .then(() => {
            this.onAfterWritePath('set', childValue, path);
            //console.log(`setChild: ${ref} = ${childValue}`);
          })
        );
      }
      catch (err) {
        this._onError('setChild', ref, err);
      }
    }

    update(val) {
      const ref = this._ref;
      try {
        return (
          this.onBeforeWrite(val) &&
          this.onUpdate(val) &&
          this.onFinalizeWrite(val) &&

          ref.update(val)
          .then(() => {
            // TODO: sadly, value is not yet updated in local repository
            const newVal = val;
            return this.onAfterWrite('update', 
              newVal
              //_.zipObject(_.keys(val), _.map(val, (v,k) => _.get(newVal, k)))
            );
          })
        ); 
      }
      catch (err) {
        this._onError('update', ref, err);
      }
    }

    updateChild(path, childValue) {
      // TODO: use proper decorators for descendant paths
      const ref = this.getRef(path);
      try {
        return (
          this.onBeforeWrite(childValue) &&
          this.onUpdate(childValue) &&
          this.onFinalizeWrite(childValue) &&

          ref.update(childValue)
          .then(() => {
            const newVal = childValue;
            return this.onAfterWritePath('update', 
              newVal
              // _.zipObject(
              //   _.keys(childValue), 
              //   _.map(childValue, (v, k) => this.getDataIn(childValue, k))
              // )
            , path);
          })
        );
      }
      catch (err) {
        this._onError('updateChild', ref, err);
      }
    }

    // see: https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction
    transactionChild(cb) {
      // TODO: add write hooks!!!
      const ref = this._ref;
      try {
        return (
          this.onBeforeWrite() && 
          ref.transaction(cb)
          .then(() => this.onAfterWrite('transaction', '?'))
        );
      }
      catch (err) {
        this._onError('transactionChild', ref, err);
      }
    }

    transactionChild(path, cb) {
      // TODO: add write hooks!!!
      const ref = this.getRef(path);
      try {
        return (
          this.onBeforeWrite() && 
          ref.transaction(cb)
          .then(() => this.onAfterWritePath('transaction', '?', path))
        );
      }
      catch (err) {
        this._onError('transactionChild', ref, err);
      }
    }
  }

  return RefWrapperBase;
}
