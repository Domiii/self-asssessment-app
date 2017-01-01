import _ from 'lodash';
import { pathJoin } from 'src/util/pathUtil';
import { createSelector } from 'reselect';
import Firebase from 'firebase';
import { helpers } from 'redux-react-firebase';
const { pathToJS, isLoaded, dataToJS } = helpers;


export function authenticate(provider) {
  return Firebase.auth().signInWithRedirect(provider);
};

export function signInWithGithub() {
  return authenticate(new Firebase.auth.GithubAuthProvider());
};


export function signInWithGoogle() {
  return authenticate(new Firebase.auth.GoogleAuthProvider());
};


export function signInWithTwitter() {
  return authenticate(new Firebase.auth.TwitterAuthProvider());
};


export function isInitialized(firebaseApp) {
  return isLoaded(pathToJS(firebaseApp, 'auth'));
};

export function isAuthenticated(firebaseApp) {
  //return !!Firebase.auth().currentUser;
  return !!pathToJS(firebaseApp, 'auth');
};

// get data at given path from current state in store
export function makeGetDataDefault(firebaseDataRoot, path) {
  return () => dataToJS(firebaseDataRoot, path);
};

/**
 * Provide path, relative to parent (root) path, given user-provided props object.
 * MUST be provided for all children. OPTIONAL in root.
 * @callback refWrapper~getPathFunc
 * @param {object} props
 */

/**
 * Wrap data access to a specific path in your Firebase DB (and it's child paths).
 * NOTE that the `redux-react-firebase` module internally already takes care of
 *    dispatching actions for firebase operations and reducing firebase data.
 * 
 * @param {object|string} cfgOrPath.path|cfgOrPath The path of the given ref wrapper.
 * @param {object} [cfgOrPath.children] Children wrappers within the same rootPath.
 * @param {object} [cfgOrPath.methods] Custom set of methods (selectors/actions) for this specific data set.
 * @param {object} [cfgOrPath.inheritedMethods] These methods will be inherited by all children.
 * 
 * returns a new function wrapper(firebaseDataRoot, props) with the following properties:
 *  Parent, pathName, getPath, and all corresponding child wrapper functions
 *
 * TODO: Use reselect + internal caching so we can reduce re-creation of wrappers
 */
export function refWrapper(cfgOrPath) {
  return _refWrapper(null, cfgOrPath);
}

function _refWrapper(parent, cfgOrPath) {
  let cfg;
  if (_.isString(cfgOrPath)) {
    cfg = { path: cfgOrPath };
  }
  else {
    cfg = cfgOrPath;
  }
  console.assert(!!cfg, 'config was not provided under: ' + (parent && parent.path));

  const { path, children } = cfg;
  const fullPath = parent.path && pathJoin(parent.path, path) || path;
  const getPath = createPathGetterFromTemplateProps(fullPath);
  
  const WrapperClass = createRefWrapperBase();
  const inheritedMethods = cfg.inheritedMethods || {};

  if (parent && parent.inheritedMethods) {
    Object.assign(inheritedMethods, parent.inheritedMethods);
  }
  Object.assign(WrapperClass.prototype, inheritedMethods);

  if (cfg.methods) {
    Object.assign(WrapperClass.prototype, cfg.methods);
  }

  createChildDataAccessors(WrapperClass.prototype, cfg.children);

  const func = createWrapperFunc(parent, WrapperClass);
  if (cfg.static) {
    Object.assign(func, cfg.static);
  }
  func.parent = parent;
  func.pathName = pathName;
  func.getPath = getPath;
  func.inheritedMethods = inheritedMethods;

  // recurse and repeat for all children
  if (cfg.children) {
    WrapperClass._ChildWrappers = {};
    for (let wrapperName in cfg.children) {
      const childCfg = cfg.children[wrapperName];

      WrapperClass._ChildWrappers = func[wrapperName] = _refWrapper(func, childCfg);
    }
  }

  return func;
}

function createChildDataAccessors(prototype, children, parentPath) {
  if (!children) {
    return;
  }

  for (let wrapperName in cfg.children) {
    const childCfg = cfg.children[wrapperName];

    // the path is the relative path between the node we are accessing and the current child
    // NOTE: The path is NOT the full path.
    const path = (parentPath || '') + childCfg.path;
    const getPath = createPathGetterFromTemplateArray(path);

    // get
    prototype[wrapperName] = createChildDataGet(getPath);

    // set
    prototype['set_' + wrapperName] = createChildDataSet(getPath);

    // update
    prototype['update_' + wrapperName] = createChildDataUpdate(getPath);

    // keep going
    createChildDataAccessors(prototype, childCfg.children);
  }
}

function createChildDataGet(getPath) {
  return function _get(args) {
    const path = getPath(args);
    return this.getData(path);
  };
}
function createChildDataSet(getPath) {
  if (getPath.hasVariables) {
    return function _set(args, data) {
      const path = getPath(args);
      return this.setChild(path, args);
    };
  }
  else {
    const path = getPath();
    return function _set(data) {
      return this.setChild(path, args);
    };
  }
}
function createChildDataUpdate(getPath) {
  if (getPath.hasVariables) {
    return function _update(args, data) {
      const path = getPath(args);
      return this.updateChild(path, args);
    };
  }
  else {
    const path = getPath();
    return function _update(data) {
      return this.updateChild(path, args);
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
  let lastIndex = 0;
  let match;
  while ((match = varRe.exec(text)) != null) {
    const matchStart = match.index, matchEnd = varRe.lastIndex;
    let prevText = text.substring(lastIndex, matchStart);
    let varName = match[1];

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
    nodes
  };
}

function createPathGetterFromTemplateProps(path) {
  const varLookup = (props, varName, iArg) => {
    if (!props || props[varName] === undefined) {
      throw new Exception(`invalid arguments: ${varName} was not provided for path ${path}`);
    }
    return props[varName];
  }
  const substituter = function getPath(props) {
    return pathInfo.nodes.map(node => node(props)).join('');
  };

  return createPathGetterFromTemplate(path, varLookup, substituter);
}

// 
function createPathGetterFromTemplateArray(path) {
  const varLookup = (args, varName, iArg) => {
    if (!args || args[iArg] === undefined) {
      throw new Exception(`invalid arguments: ${varName} was not provided for path ${path}`);
    }
    return args[iArg];
  };
  const substituter = function getPath(...args) {
    return pathInfo.nodes.map(node => node(args)).join('');
  };
  return createPathGetterFromTemplate(path, varLookup, substituter);
}

function createPathGetterFromTemplate(path, varLookup, substituter) {
  const pathInfo = parseTemplateString(path, varLookup);
  let getPath;
  if (pathInfo.nVars > 0) {
    // template substitution from array
    getPath = substituter;
    getPath.hasVariables = true;
  }
  else {
    // no variable substitution necessary
    getPath = function getPath() { return path; };
    getPath.hasVariables = false;
  }
  return getPath;
}

function createWrapperFunc(parent, RefClass) {
  return function wrapper(firebaseDataRoot, props) {
    props = props || {};
    let path = RefClass.getPath(props);
    path = path.endsWith('/') ? path.substring(0, path.length-1) : path;
    const getData = makeGetDataDefault(firebaseDataRoot, path);

    const db = props && props.db || Firebase.database();
    const ref = db.ref(path);
    const refWrapper = new RefClass();
    refWrapper.Parent = parent;
    refWrapper.__init(path, getData, ref, props);
    return refWrapper;
  };
}

function createRefWrapperBase() {
  class RefWrapperBase {
    __init(getData, ref, props) {
      //this._clazz = clazz;
      this._ref = ref;

      // getData(path) function returns data at given database path
      this._getData = getData;

      if (_.isFunction(this.updateProps)) {
        this.updateProps(props);
      }
      this.props = props;
    }

    get val() {
      return this._getData();
    }

    get isLoaded() {
      return isLoaded(this.val);
    }

    getData(path, defaultValue) {
      if (!path) {
        path = '';
      }
      else if (path.startsWith('/')) {
        console.warning('invalid path: should not start with slash (/)');
      }

      const ancestor = this._getData();
      if (!path) {
        return ancestor === undefined ? defaultValue : ancestor;
      }

      path = path.replace(/\//g, '.');    // lodash uses dot notation for path access
      return _.get(ancestor, path, defaultValue);
    }

    getRef(path) {
      return path && this._ref.child(path) || this._ref;
    }

    set(val) {
      return this._ref.set(val);
    }

    setChild(path, newChild) {
      return this.getRef(path).set(newChild);
    }

    update(values) {
      return this._ref.update(values);
    }

    updateChild(path, childValues) {
      return this.getRef(path).update(childValues);
    }


    // see: https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction
    transaction(cb) {
      return this._ref.transaction(cb);
    }

    transactionChild(path, cb) {
      return this.getRef(path).transaction(cb);
    }

    push(newChild) {
      return this._ref.push(newChild);
    }

    pushChild(path, newChild) {
      return this.getRef(path).push(newChild);
    }
  }

  return RefWrapperBase;
}
