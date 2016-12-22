import { createSelector } from 'reselect';
import { helpers } from 'redux-react-firebase';
const { isLoaded, dataToJS } = helpers;

export function isInitialized(firebaseApp) {
  return isLoaded(pathToJS(firebaseApp, 'auth'));
}

export function isAuthenticated(firebaseApp) {
  return !!pathToJS(firebaseApp, 'auth');
}

// get data at given path from current state in store
// const { firebase } = this.context.store;
export function makeGetDataDefault(firebaseApp) {
  return path => dataToJS(firebaseApp, path);
}


// Provides some convinience operations for working with a specific path of Firebase.
// NOTE that the `redux-react-firebase` module internally already takes care of
//    dispatching actions for firebase operations and reducing firebase data.
export class RefWrapper {
  constructor(db, getData, path) {
    this._db = db || Firebase.database();
    this._ref = this._db.ref(path);
    this._path = path;

    // getData function returns data at given database path
    this.getData = getData;
  }

  set(val) {
    return this._ref.set(val);
  }

  update(values) {
    return this._ref.update(values);
  }

  setChild(path, newChild) {
    return this._ref.child(path).set(newChild);
  }

  updateChild(path, childUpdates) {
    return this._ref.child(path).update(childUpdates);
  }

  pushChild(newChild) {
    return this._ref.push(newChild);
  }
}