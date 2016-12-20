import { createSelector } from 'reselect';

// TODO:
// * DB util provides ref
// * get path from ref.toString()
// * Somehow tie ref wrappers in with the @firebase decorator
// * Create selectors for getting records/children
// * actions + reducers have already been taken care of

export class FirebaseRefWrapper {
  constructor(ref) {
    this._ref = ref;
    this._path = ref.toString();
  }

  getChild(id) {
    return ;
  }

  setChild(id, newChild) {
    
  }

  mergeChild(id, newChild) {

  }

  pushChild(newChild) {
    
  }

  get() {
    return this._val;
  }

  set(val) {
  }
}