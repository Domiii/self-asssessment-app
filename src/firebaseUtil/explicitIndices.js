import map from 'lodash/map';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import autoBind from 'auto-bind';

import { pathJoin } from 'src/util/pathUtil';

import { 
  makeRefWrapper,
  addChildrenToRefWrapper
} from 'src/firebaseUtil';

const staticConfig = {
  indexRoot: '_index'
};

/**
 * ========================
 * Usage Steps
 * ========================
 * 1. make queries on page level
 * 2. create index ref object in @connect on list level
 * 3. access dependent refs from index ref
 *
 * ========================
 * Init Example
 * ========================

     export const UserGroupRef = m2mIndex((firebaseRoot) => [
      'userGroups',

      'user',
      'group',
      
      UserInfoRef(firebaseRoot),
      GroupsRef(firebaseRoot),

      customMembers
    ]);
 *  
 *
 * ========================
 * Usage Example
 * ========================
 * const userGroupRef = UserGroupRef(firebase);
 */

export function m2mIndex(argsCreator) {
  return (...args) => {
    const indexArgs = argsCreator(...args);
    return new M2MExplicitIndex(...indexArgs);
  };
}

function sanitizeExplicitIndexConfig(cfg) {
  if (!isString(cfg.pathName)) {
    throw new Error('invalid explicitIndex: ' +
      JSON.stringify(cfg, null, 2));
  }
};


class BaseExplicitIndex {
  // constructor(indexName, keyName, ref) {
  //   // name of the index
  //   this.indexName = indexName;

  //   // name of the key under which the index information is stored in ref objects
  //   this.baseKeyName = baseKeyName;

  //   // the ref object wrapping the firebase path
  //   this.ref = ref;
  // }

  // getExplicitIndexPath() {
  //   const {
  //     indexName, ref
  //   } = this;
  //   let indexPath = pathJoin(staticConfig.indexRoot, ref.path);
  //   indexPath = pathJoin(indexPath, indexName);
  //   return indexPath;
  // }

  // // queries the entire reference path + index, and 
  // //    validates index integrity
  // // returns a promise which eventually returns a set
  // //    of inconsistencies (if any)
  // validateIndex() {

  // }

  // // used to rebuild given index
  // //  (e.g. when it's new, broken or structurally modified)
  // buildIndex() {

  // }
}


const m2mExplicitIndexRef = makeRefWrapper({
  pathTemplate: staticConfig.indexRoot
});


function addM2MIndexRef(indexName, leftEntryRef, rightEntryRef) {
  const leftPath = leftEntryRef.path;
  const rightPath = rightEntryRef.path;

  addChildrenToRefWrapper(m2mExplicitIndexRef, {
    [indexName]: {
      pathTemplate: indexName,

      children: {
        left: leftPath,
        right: rightPath
      }
    }
  });

  return m2mExplicitIndexRef[indexName];
}

/**
 * Many-to-many explicit index.
 * Structure layout:
 *  _index.<m2mindexName>.<leftName> -> <leftId>: <rightIds>*
 *  _index.<m2mindexName>.<rightName> -> <rightId>: <leftIds>*
 *
 * Note: the "left" index maps "left ids" to "right data"
 *    This means that if your left index is "user",
 *    and the right is "group", then the left index stores
 *    userId -> { groupIds }, and vice versa.
 */
class M2MExplicitIndex {
  constructor(
      indexName, 
      leftName, rightName, 
      leftEntryRef, rightEntryRef,
      members
    ) {
    this.indexName = indexName;
    this.leftEntryRef = leftEntryRef;
    this.rightEntryRef = rightEntryRef;

    this.leftName = leftName;
    this.rightName = rightName;

    this._firebaseDataRoot = leftEntryRef._firebaseDataRoot;

    this.refs = {
      [leftName]: leftEntryRef,
      [rightName]: rightEntryRef
    };

    Object.assign(this, members);

    const IndexRef = addM2MIndexRef(indexName, leftEntryRef, rightEntryRef);

    //this.indexRef = IndexRef(this._firebaseDataRoot);
    this.leftIndexRef = IndexRef.left(this._firebaseDataRoot);
    this.rightIndexRef = IndexRef.right(this._firebaseDataRoot);


    this[`get_${leftName}_by_${rightName}`] = this.getLeftEntriesByRightId;
    this[`get_${rightName})_by_${rightName}`] = this.getRightEntriesByLeftId;
    this[`findUnassigned_${leftName}_ids`] = this.findUnassignedLeftIds;
    this[`findUnassigned_${leftName}_entries`] = this.findUnassignedLeftEntries;
    this[`findUnassigned_${rightName}_ids`] = this.findUnassignedRightIds;
    this[`findUnassigned_${rightName}_entries`] = this.findUnassignedRightEntries

    autoBind(this);
  }

  _addQuery(queryArr, basePath, id) {
    if (isArray(id)) {
      for (var i = 0; i < id.length; ++i) {
        queryArr.push(pathJoin(basePath, id[i]));
      }
    }
    else {
      queryArr.push(pathJoin(basePath, id));
    }
  }

  // TODO: add limits + other kinds of queries
  addQueries(queryArr, { leftId, rightId }) {
    const newFilter = { leftId, rightId };
    if (this.filter) {
      // if (!isEqual(this.filter, newFilter)) {
      //   throw new Error('tried to initialize same index with different configurations');
      // }
      this.filter = newFilter;
    }

    const leftPath = this.getLeftPath();
    const rightPath = this.getRightPath();

    if (leftId) {
      this._addQuery(queryArr, leftPath, leftId);
    }
    if (rightId) {
      this._addQuery(queryArr, rightPath, rightId);
    }
  }

  * findUnassignedLeftIds() {
    const leftIndexData = this.leftIndexRef.val;
    const leftData = this.leftRef.val;

    for (let leftId in leftData) {
      if (isEmpty(leftIndexData[leftId])) {
        yield leftId;
      }
    }
  }

  * findUnassignedLeftEntries() {
    const leftIndexData = this.leftIndexRef.val;
    const leftData = this.leftRef.val;
    const leftName = this.leftName

    for (let leftId in leftData) {
      if (isEmpty(leftIndexData[leftId])) {
        yield {
          id: leftId,
          [leftName]: leftData[leftId]
        };
      }
    }
  }

  * findUnassignedRightIds() {
    const rightIndexData = this.rightIndexRef.val;
    const rightData = this.rightRef.val;

    for (let rightId in rightData) {
      if (isEmpty(rightIndexData[rightId])) {
        yield rightId;
      }
    }
  }

  * findUnassignedRightEntries() {
    const rightIndexData = this.rightIndexRef.val;
    const rightData = this.rightRef.val;
    const rightName = this.rightName;

    for (let rightId in rightData) {
      if (isEmpty(rightIndexData[rightId])) {
        yield {
          id: rightId,
          [rightName]: rightData[rightId]
        };
      }
    }
  }

  findUnassignedLeftEntries() {
    const leftData = this.leftIndexRef.val;
  }

  getLeftIdsByRightId(rightIds) {
    const leftIds = this.rightIndexRef.getAllData(rightIds);
    return Object.keys(leftIds);
  }

  getRightIdsByLeftId(leftIds) {
    const rightIds = this.leftIndexRef.getAllData(leftIds);
    return Object.keys(rightIds);
  }

  getLeftEntriesByRightId(rightIds) {
    const leftIds = this.getLeftIdsByRightId(rightIds);
    return this.leftEntryRef.getAllData(leftIds);
  }

  getRightEntriesByLeftId(leftIds) {
    const rightIds = this.getRightIdsByLeftId(leftIds);
    return this.rightEntryRef.getAllData(rightIds);
  }

  addEntry(entry) {
    const leftId = entry[this.leftName];
    const rightId = entry[this.rightName];

    return Promise.all([
      this.rightIndexRef.setChild(pathJoin(rightId, leftId), 1),
      this.leftIndexRef.setChild(pathJoin(leftId, rightId), 1)
    ]);
  }

  deleteEntry(entry) {
    const leftId = entry[this.leftName];
    const rightId = entry[this.rightName];
    
    return Promise.all([
      this.rightIndexRef.setChild(pathJoin(rightId, leftId), null),
      this.leftIndexRef.setChild(pathJoin(leftId, rightId), null)
    ]);
  }

  // queries the entire reference path + index, and 
  //    validates index integrity
  // returns a promise which eventually returns a set
  //    of inconsistencies (if any)
  validateIndex() {
    if (this.filter && !isEmpty(this.filter)) {
      throw new Error('cannot validate index when filter is active');
    }
    const leftData = this.leftIndexRef.val;
    const rightData = this.rightIndexRef.val;
    
    const inconsistencies = [];

    // for every right id R added to the left id L,
    //    L must also be added to R
    for (let leftId in leftData) {
      const rightIds = leftData[leftId];
      for (let rightId in rightIds) {
        const rightEntry = rightData[rightId];
        if (!rightEntry[leftId]) {
          inconsistencies.push([leftId, rightId]);
        }
      }
    }

    // for every L added to R,
    //    R must also be added to L
    for (let rightId in rightData) {
      const leftIds = rightData[rightId];
      for (let leftId in leftIds) {
        const leftEntry = leftData[leftId];
        if (!leftEntry[rightId]) {
          inconsistencies.push([leftId, rightId]);
        }
      }
    }


    // TODO: check if all indexed objects actually exist in leftEntryRef + rightEntryRef

    return inconsistencies;
  }

  // used to rebuild given index
  //  (e.g. when it's new, broken or structurally modified)
  fixInconsistencies(inconsistencies) {
    if (this.filter && !isEmpty(this.filter)) {
      throw new Error('cannot build index when filter is active');
    }

    for (let i = 0; i < inconsistencies.length; ++i) {
      const [leftId, rightId] = inconsistencies[i];
      // TODO: fix it!
    }
  }
}
