import _ from 'lodash';
import { createSelector } from 'reselect';
import Firebase from 'firebase';
import { helpers } from 'redux-react-firebase';
const { pathToJS, isLoaded, dataToJS } = helpers;


export function authenticate(provider) {
  return Firebase.auth().signInWithRedirect(provider);
}

export function signInWithGithub() {
  return authenticate(new Firebase.auth.GithubAuthProvider());
}


export function signInWithGoogle() {
  return authenticate(new Firebase.auth.GoogleAuthProvider());
}


export function signInWithTwitter() {
  return authenticate(new Firebase.auth.TwitterAuthProvider());
}


export function isInitialized(firebaseApp) {
  return isLoaded(pathToJS(firebaseApp, 'auth'));
}

export function isAuthenticated(firebaseApp) {
  //return !!Firebase.auth().currentUser;
  return !!pathToJS(firebaseApp, 'auth');
}

// get data at given path from current state in store
export function makeGetDataDefault(firebaseWrapper) {
  return path => dataToJS(firebaseWrapper, path);
}

export function wrapPath(firebaseWrapper, path, RefClass) {
  const getData = makeGetDataDefault(firebaseWrapper);
  return new (RefClass || RefWrapper)(path, getData);
}


export const defaultRefFactory(RefClass) {
  return function getDefault(state) { 
    const getData = makeGetDataDefault(state);
    return new RefClass(getData);
  };
}

// TODO: Change RefWrapper to class factory and make access to getData, getDefault + PATH_ROOT easier
// TODO: use reselect for improved performance
//    see: http://codepen.io/Domiii/pen/apomGQ?editors=0010

// Provides some convinience operations for working with a specific path of Firebase.
// NOTE that the `redux-react-firebase` module internally already takes care of
//    dispatching actions for firebase operations and reducing firebase data.
export class RefWrapper {
  constructor(path, getData, db) {
    this._db = db || Firebase.database();
    this._ref = this._db.ref(path);
    this._path = path.endsWith('/') ? path.substring(0, path.length-1) : path;

    // getData(path) function returns data at given database path
    this._getData = getData;
  }

  get rootData() {
    return this.getData();
  }

  get isLoaded() {
    return isLoaded(this.rootData);
  }

  getData(path, defaultValue) {
    if (!path) {
      path = '';
    }
    else if (path.startsWith('/')) {
      console.warning('invalid path: should not start with slash (/)');
    }

    const ancestor = this._getData(this._path);
    if (!path) {
      return ancestor === undefined ? defaultValue : ancestor;
    }

    path = path.replace(/\./g, '/');
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