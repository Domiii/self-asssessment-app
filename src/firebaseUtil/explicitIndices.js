import {
  map,
  isString
} from 'lodash';


export function sanitizeExplicitIndexConfig(cfg) {
  if (!isString(cfg.pathName)) {
    throw new Error('invalid explicitIndex: ' +
      JSON.stringify(cfg, null, 2));
  }
};

export function getExplicitIndexPath(indexName, ref) {
  
}


// queries the entire reference path + index, and 
//    validates index integrity
// returns a promise which eventually returns a set
//    of inconsistencies (if any)
export function validateIndex(indexName, ref) {

}

// used to rebuild given index
//  (e.g. when it's new, broken or structurally modified)
export function buildIndex(indexName, ref) {

}
