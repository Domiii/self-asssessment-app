import { createSelector } from 'reselect';

// TODO:
// * DB util provides ref
// * get path from ref.toString()
// * Somehow tie ref wrappers in with the @firebase decorator
// * Create selectors for getting records/children
// * actions + reducers have already been taken care of

export class RefWrapper {
  constructor(db, path) {
    this._db = db || Firebase.database();
    this._ref = this._db.ref(path);
    this._path = path;
  }

  get() {
    return this._val;
  }

  getChild(id) {
    return ;
  }

  set(val) {
  }

  setChild(id, newChild) {
    
  }

  mergeChild(id, newChild) {

  }

  pushChild(newChild) {
    
  }
}