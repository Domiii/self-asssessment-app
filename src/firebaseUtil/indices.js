import _ from 'lodash';


export function makeIndices(cfg) {
  return new IndexSet(cfg);
}

var IndexUtils = {
  convertToSortedValueSet(val) {
    if (_.isArray(val)) {
      return _.map(val, this.convertToSortedValueSet.bind(this));
    }
    else if (_.isObject(val)) {
      const converted = _.flatten(_.map(val, (v, k) => [k, this.convertToSortedValueSet(v)]));
      return _.sortBy(converted, tuple => tuple[0]);
    }
    return val;
  },

  // makes sure that two vals will always convert to the same string
  // given that the structure of any two different vals of the same set does not change too much.
  encodeValueDeep(val) {
    if (val === undefined) {
      val = null;
    }

    if (_.isObject(val) || _.isArray(val)) {
      return JSON.stringify(this.convertToSortedValueSet(val));
    }
    else {
      return val + "";
    }
  }
};

class IndexSet {

  /**
   * {cfg} Index definitions: Each index name is assigned an array of all keys that participate in it.
   */
  constructor(cfg) {
    const indexNamesByKey = {};
    for (const indexName in cfg) {
      const keys = cfg[indexName];
      keys.forEach(key => 
        indexNamesByKey[key] = indexNamesByKey[key] && indexNamesByKey[key].push(indexName) || [indexName]);
    }

    this.cfg = cfg;
    this.keysByIndexName = cfg;
    this.indexNames = _.keys(cfg);
    this.keys = _.keys(indexNamesByKey);
    this.indexNamesByKey = indexNamesByKey;
  }

  // names of all indices this key is participating in
  getIndexNamesByKey(key) {
    return this.indexNamesByKey[key];
  }

  getIndexNameByKeys(keys) {
    return _.findKey(this.keysByIndexName, v => _.isEqual(v, keys));
  }

  // array of keys participating in the given query
  getKeysOfQuery(query) {
    return _.keys(query);
  }

  //  
  getIndexNameOfQuery(query) {
    const name = _.findKey(this.keysByIndexName, _.keys(query));
    console.assert(name,
      `Query contains keys that are not indexed: ${JSON.stringify(query)}. - All keys: ${this.keys}`);
    return name;
  }

  // 
  isIndexedKey(key) {
    return !!this.indexNamesByKey[key];
  }

  encodeQuery(query) {
    const keys = _.keys(query);
    const indexName = this.getIndexNameByKeys(keys);
    if (!indexName) {
      throw new Error('invalid query - keys did not match any index: ' + JSON.stringify(query));
    }
    const queryValue = this.encodeQueryValue(query, keys);
    return {
      [indexName]: queryValue
    }
  }

  where(query) {
    const keys = _.keys(query);
    const indexName = this.getIndexNameByKeys(keys);
    if (!indexName) {
      throw new Error('invalid query - keys did not match any index: ' + JSON.stringify(query));
    }
    const queryValue = this.encodeQueryValue(query, keys);
    // console.log({
    //   orderByChild: indexName,
    //   equalTo: queryValue
    // });
    return {
      orderByChild: indexName,
      equalTo: queryValue
    };
  }

  encodeQueryValue(val, keys) {
    if (!keys || !keys.length) {
      console.error('Invalid query: Empty keys given.');
    }
    if (keys.length == 1) {
      return IndexUtils.encodeValueDeep(val[keys[0]]);
    }
    const values = _.map(keys, key => val[key]);
    return IndexUtils.encodeValueDeep(values);
  }

  // TODO: Properly handle scenarios:
  //    "index needs updating during set"
  //    "index needs updating during update and only partial value is given"
  updateIndices(val) {
    for (var indexName in this.keysByIndexName) {
      if (!val[indexName]) {
        const keys = this.keysByIndexName[indexName];
        if (keys.length < 2) continue;

        if (_.some(keys, key => !_.has(val, key))) {
          console.error(`Updated value did not define index "${indexName}", and is also missing some of its keys: 
            [${keys}]\n${JSON.stringify(val)}`);
          continue;
        }

        val[indexName] = this.encodeQueryValue(val, keys);
      }
    }
  }
}