import { createSelector } from 'reselect';
import Firebase from 'firebase';
import { helpers } from 'redux-react-firebase';

const { pathToJS, isLoaded, dataToJS } = helpers;

export function isInitialized(firebaseApp) {
  return isLoaded(pathToJS(firebaseApp, 'auth'));
}

export function isAuthenticated(firebaseApp) {
  return !!pathToJS(firebaseApp, 'auth');
}

// get data at given path from current state in store
export function makeGetDataDefault(firebaseWrapper) {
  return path => dataToJS(firebaseWrapper, path);
}

export function makeGetDataImmutable(immutableObj) {
  return immutableObj.getIn();
}

export function wrapPath(firebaseWrapper, path, RefClass) {
  const getData = makeGetDataDefault(firebaseWrapper);
  return new (RefClass || RefWrapper)(path, getData);
}


// Provides some convinience operations for working with a specific path of Firebase.
// NOTE that the `redux-react-firebase` module internally already takes care of
//    dispatching actions for firebase operations and reducing firebase data.
export class RefWrapper {
  constructor(path, getData, db) {
    this._db = db || Firebase.database();
    this._ref = this._db.ref(path);
    this._path = path.endsWith('/') ? path : (path + '/');

    // getData(path) function returns data at given database path
    this._getData = getData;
  }

  get rootData() {
    return this.getData();
  }

  getData(path) {
    return this._getData(this._path + (path || ''));
  }


  set(val) {
    return this._ref.set(val);
  }

  setChild(path, newChild) {
    return this._ref.child(path).set(newChild);
  }

  update(values) {
    return this._ref.update(values);
  }

  updateChild(path, childValues) {
    return this._ref.child(path).update(childValues);
  }


  // see: https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction
  transaction(cb) {
    return this._ref.transaction(cb);
  }

  transactionChild(path, cb) {
    return this._ref.child(path).transaction(cb);
  }

  pushChild(newChild) {
    return this._ref.push(newChild);
  }
}