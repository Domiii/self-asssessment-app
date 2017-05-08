import _ from 'lodash';
import { pathJoin } from 'src/util/pathUtil';
import { createSelector } from 'reselect';
import { helpers, getFirebase } from 'react-redux-firebase';
import { makeIndices } from './indices';
import { EmptyObject } from 'src/util';

const { pathToJS, isLoaded, isEmpty, dataToJS, populatedDataToJS } = helpers;

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


// export function authenticate(provider) {
//   return getFirebase().auth().signInWithRedirect(provider);
// };

// export function signInWithGithub() {
//   return authenticate(new getFirebase().auth.GithubAuthProvider());
// };


// export function signInWithGoogle() {
//   return authenticate(new getFirebase().auth.GoogleAuthProvider());
// };


// export function signInWithTwitter() {
//   return authenticate(new getFirebase().auth.TwitterAuthProvider());
// };

export function isAuthenticated(firebaseApp) {
  return !!getFirebase().auth().currentUser;
};

// get data at given path from current state in store
export function makeGetDataDefault(firebaseDataRoot, path, queryArgs) {
  if (_.isPlainObject(queryArgs) && queryArgs.populates) {
    return () => populatedDataToJS(firebaseDataRoot, path, queryArgs.populates);
  }
  return () => dataToJS(firebaseDataRoot, path);
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
  return _makeRefWrapper(defaultConfig, null, cfgOrPath);
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
  else if (_.isArray(args)) {
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

// converts query objects into propriotory `redux-react-firebase` query syntax
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

function _makeRefWrapper(inheritedSettings, parent, cfgOrPath) {
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
  func.makeQuery = (makeQuery || _makeMakeQuery(getPath, queryString)).bind(func);

  // recurse and add all children
  cascadingMethods = cascadingMethods || {};
  if (children) {
    WrapperClass._ChildWrappers = {};
    for (let wrapperName in children) {
      const childCfg = children[wrapperName];

      WrapperClass._ChildWrappers = func[wrapperName] = 
        _makeRefWrapper(inheritedSettings, func, childCfg);

      if (childCfg.cascadingMethods) {
        // add all descendant cascading methods as well
        Object.assign(cascadingMethods, childCfg.cascadingMethods);
      }
    }
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

function createDataAccessors(prototype, children, variableTransform) {
  // add all children
  createChildDataAccessors(prototype, children, '', variableTransform);
}

function createChildDataAccessors(prototype, children, parentPathTemplate, variableTransform) {
  if (!children) {
    return;
  }

  for (let wrapperName in children) {
    const childCfgOrPath = children[wrapperName];
    const childPath = _.isString(childCfgOrPath) && childCfgOrPath || (childCfgOrPath && childCfgOrPath.pathTemplate || '');
    if (!childPath) {
      throw new Error(`invalid: no path given for '${wrapperName}' under '${parentPathTemplate}'`);
    }

    // the path is the relative path from the node of given prototype to current child
    // NOTE: The path is NOT the full path.
    // NOTE2: The path for `push` is actually the path up to and including the parent only.
    const pathTemplate = pathJoin(parentPathTemplate, childPath);
    const getPath = createPathGetterFromTemplateArray(pathTemplate, variableTransform);
    const addGetPath = createPathGetterFromTemplateArray(parentPathTemplate, variableTransform);

    if (prototype[wrapperName]) {
      throw new Error(`invalid: duplicate path name '${wrapperName}' under '${parentPathTemplate}'`);
    }

    // get
    prototype[wrapperName] = createChildDataGet(getPath);

    // add
    prototype['push_' + wrapperName] = createChildDataPush(addGetPath);

    // set
    prototype['set_' + wrapperName] = createChildDataSet(getPath);

    // update
    prototype['update_' + wrapperName] = createChildDataUpdate(getPath);

    // batch update (add to a single bigger update, instead of sending out multiple smaller updates individually)
    prototype['batchUpdate_' + wrapperName] = createAddChildDataUpdate(getPath);

    // delete
    prototype['delete_' + wrapperName] = createChildDataDelete(getPath);

    // keep going
    createChildDataAccessors(prototype, childCfgOrPath.children, pathTemplate);
  }
}

function createChildDataGet(getPath) {
  return function _get(...args) {
    const path = getPath(...args);
    return this.getData(path);
  };
}
function createChildDataPush(getPath) {
  if (getPath.hasVariables) {
    return function _push(...args) {
      const pathArgs = _.initial(args);
      const data = _.last(args);
      const path = getPath(...pathArgs);
      return this.pushChild(path, data);
    };
  }
  else {
    const path = getPath();
    return function _push(data) {
      return this.pushChild(path, data);
    };
  }
}
function createChildDataSet(getPath) {
  if (getPath.hasVariables) {
    return function _set(...args) {
      const pathArgs = _.initial(args);
      const data = _.last(args);
      const path = getPath(...pathArgs);
      return this.setChild(path, data);
    };
  }
  else {
    const path = getPath();
    return function _set(data) {
      return this.setChild(path, data);
    };
  }
}
function createChildDataUpdate(getPath) {
  if (getPath.hasVariables) {
    return function _update(...args) {
      const pathArgs = _.initial(args);
      const data = _.last(args);
      const path = getPath(...pathArgs);
      return this.updateChild(path, data);
    };
  }
  else {
    const path = getPath();
    return function _update(data) {
      return this.updateChild(path, data);
    };
  }
}
function createAddChildDataUpdate(getPath) {
  if (getPath.hasVariables) {
    return function _update(update, ...args) {
      const pathArgs = _.initial(args);
      const data = _.last(args);
      const path = getPath(...pathArgs);
      update[path] = update[path] && _.merge(update[path], data) || data;
    };
  }
  else {
    const path = getPath();
    return function _update(update, data) {
      update[path] = update[path] && _.merge(update[path], data) || data;
    };
  }
}
function createChildDataDelete(getPath) {
  if (getPath.hasVariables) {
    return function _delete(...args) {
      const path = getPath(...args);
      return this.setChild(path, null);
    };
  }
  else {
    const path = getPath();
    return function _delete() {
      return this.setChild(path, null);
    };
  }
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

// see: http://codepen.io/Domiii/pen/zNOEaO?editors=0010
function parseTemplateString(text, varLookup) {
  const varRe = /\$\(([^)]+)\)/g;

  text = text || '';
  let nVars = 0, nTexts = 0;
  function textNode(text) {
    ++nTexts;
    return props => text;
  }
  function varNode(varName) {
    const iVar = nVars;
    ++nVars;
    return args => {
      return varLookup(args, varName, iVar);
    };
  }

  const nodes = [];
  const varNames = [];
  let lastIndex = 0;
  let match;
  while ((match = varRe.exec(text)) != null) {
    const matchStart = match.index, matchEnd = varRe.lastIndex;
    let prevText = text.substring(lastIndex, matchStart);
    let varName = match[1];
    varNames.push(varName);

    if (prevText.length > 0) {
      nodes.push(textNode(prevText));
    }
    nodes.push(varNode(varName));

    lastIndex = matchEnd;
  }

  let prevText = text.substring(lastIndex, text.length);
  if (prevText.length > 0) {
    nodes.push(textNode(prevText));
  }

  return {
    nVars,
    nTexts,
    varNames,
    nodes
  };
}

function _makePathVariable(val, variableTransform) {
  if (_.isPlainObject(val)) {
    // use index transformation for variable
    return variableTransform(val);
  }
  return val;
}

// creates a function that plugs in path variables from a single plain object argument that names variables explicitely
function createPathGetterFromTemplateProps(pathTemplate, variableTransform) {
  const varLookup = (props, varName, iArg) => {
    if (!props || props[varName] === undefined) {
      throw new Error(`invalid arguments: ${varName} was not provided for path ${pathTemplate}`);
    }

    return _makePathVariable(props[varName], variableTransform);
  }

  const getPathWithVariables = function getPathWithVariables(props) {
    return getPathWithVariables.pathInfo.nodes.map(node => node(props)).join('');
  };

  return createPathGetterFromTemplate(pathTemplate, varLookup, getPathWithVariables);
}

// creates a function that plugs in path variables from the function's arguments
function createPathGetterFromTemplateArray(pathTemplate, variableTransform) {
  const varLookup = (args, varName, iArg) => {
    if (!args || iArg >= args.length) {
      throw new Error(`invalid arguments: ${varName} was not provided for path ${pathTemplate}`);
    }

    return _makePathVariable(args[iArg], variableTransform);
  };
  const getPathWithVariables = function getPathWithVariables(...args) {
    return getPathWithVariables.pathInfo.nodes.map(node => node(args)).join('');
  };
  return createPathGetterFromTemplate(pathTemplate, varLookup, getPathWithVariables);
}

function createPathGetterFromTemplate(pathTemplate, varLookup, getPathWithVariables) {
  const pathInfo = parseTemplateString(pathTemplate, varLookup);
  let getPath;
  if (pathInfo.nVars > 0) {
    // template substitution from array
    getPath = getPathWithVariables;
    getPath.hasVariables = true;
    getPath.pathInfo = pathInfo;
  }
  else {
    // no variable substitution necessary
    getPath = function getPath() { return pathTemplate; };
    getPath.hasVariables = false;
  }
  getPath.pathTemplate = pathTemplate;
  return getPath;
}

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
    refWrapper.__init(parent, getPath.pathTemplate, db, getData, ref, props);
    return refWrapper;
  };
  return f;
}

function createRefWrapperBase() {
  class RefWrapperBase {
    __init(parent, pathTemplate, db, getData, ref, props) {
      this.parent = parent;
      this.pathTemplate = pathTemplate;

      //this._clazz = clazz;
      this._db = db;
      //this._ref = ref;

      this._ref = ref;

      // getData(path) function returns data at given database path
      this._getData = getData;

      if (_.isFunction(this.updateProps)) {
        this.updateProps(props);
      }
      this.props = props;

      this.onAfterWrite = this.onAfterWrite.bind(this);
      this.onAfterWritePath = this.onAfterWritePath.bind(this);
    }

    get val() {
      return this._getData();
    }

    get isLoaded() {
      return isLoaded(this.val);
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

    getRef(path) {
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

    _doPush(ref, newChild) {
      const newRef = this.onBeforeWrite() && 
        this.onPush(newChild) &&
        this.onFinalizeWrite(newChild) &&
        ref.push(newChild);

      //newRef.then(() => this.onAfterWrite('push', newChild));
      return newRef;
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
      return (
        this.onBeforeWrite(val) &&
        this.onUpdate(val) &&
        this.onFinalizeWrite(val) &&
        ref.set(val)
        .then(() => this.onAfterWrite('set', this.val))
      );
    }

    setByIndex(indexData, childValue) {
      const key = this.indices.encodeQueryValue(indexData);
      return this.setChild(key, childValue);
    }

    setChild(path, childValue) {
      // TODO: use proper decorators for descendant paths
      const ref = this.getRef(path);
      return (
        this.onBeforeWrite(childValue) &&
        this.onUpdate(childValue) &&
        this.onFinalizeWrite(childValue) &&
        ref.set(childValue)
        .then(() => this.onAfterWritePath('set', childValue, path))
      );
    }

    update(val) {
      const ref = this._ref;
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

    updateChild(path, childValue) {
      // TODO: use proper decorators for descendant paths
      const ref = this.getRef(path);
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

    // see: https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction
    transaction(cb) {
      // TODO: add write hooks!!!
      const ref = this._ref;
      return (
        this.onBeforeWrite() && 
        ref.transaction(cb)
        .then(() => this.onAfterWrite('transaction', '?'))
      );
    }

    transactionChild(path, cb) {
      // TODO: add write hooks!!!
      const ref = this.getRef(path);
      return (
        this.onBeforeWrite() && 
        ref.transaction(cb)
        .then(() => this.onAfterWritePath('transaction', '?', path))
      );
    }
  }

  return RefWrapperBase;
}
