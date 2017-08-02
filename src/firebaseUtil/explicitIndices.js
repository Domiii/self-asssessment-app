import {
  map,
  isString
} from 'lodash';

import { pathJoin } from 'src/util/pathUtil';

const staticConfig = {
  indexRoot: '_index'
};

export function sanitizeExplicitIndexConfig(cfg) {
  if (!isString(cfg.pathName)) {
    throw new Error('invalid explicitIndex: ' +
      JSON.stringify(cfg, null, 2));
  }
};


export class ExplicitIndex {
  constructor(indexName, keyName, ref) {
    // name of the index
    this.indexName = indexName;

    // name of the key under which the index information is stored in ref objects
    this.baseKeyName = baseKeyName;

    // the ref object wrapping the firebase path
    this.ref = ref;
  }

  getExplicitIndexPath() {
    const {
      indexName, ref
    } = this;
    let indexPath = pathJoin(staticConfig.indexRoot, ref.path);
    indexPath = pathJoin(indexPath, indexName);
    return indexPath;
  }

  // queries the entire reference path + index, and 
  //    validates index integrity
  // returns a promise which eventually returns a set
  //    of inconsistencies (if any)
  validateIndex() {

  }

  // used to rebuild given index
  //  (e.g. when it's new, broken or structurally modified)
  buildIndex() {

  }
}


/**
 * Many-to-many explicit index
 */
export class MMExplicitIndex {
  constructor(indexName, ref) {
    super(indexName, ref);
  }

  addToLeft(leftId, rightId) {

  }
}
