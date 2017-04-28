import _ from 'lodash';


const defaultConfig = {
  keys: [],

  autoUpdate: true,

  // Whether to update the index on every write operation (given it's keys are present).
  // If this is set to false, it will only try to write the index when it has not previously been written.
  writeAlways: false,

  // Whether to show a warning when an index cannot be updated due to missing key data.
  // You only want to set this to true when you are sure that all required key data will be written for every possible index update.
  isRequired: false
};

export function makeIndices(cfg) {
  return new IndexSet(cfg);
}

const IndexUtils = {
  sanitizeConfig(cfg) {
    return _.zipObject(_.keys(cfg), _.map(cfg, (indexCfg, indexName) => {
      let cfgEntry;
      if (_.isArray(indexCfg)) {
        // only provide array of keys
        cfgEntry = { 
          keys: indexCfg
        };
      }
      else if (_.isString(indexCfg)) {
        // only provide name of single key
        cfgEntry = {
          keys: [indexCfg]
        };
      }
      else if (_.isObject(indexCfg)) {
        // provide full configuration for index
        if (!_.isArray(indexCfg.keys)) {
          //console.warn('Invalid index config missing or invalid keys property (should be array): ' + JSON.stringify(cfg));
        }
        cfgEntry = indexCfg;
      }
      else {
        //console.warn('Invalid index config has invalid entry: ' + indexName);
        cfgEntry = {};
      }

      return Object.assign({}, defaultConfig, cfgEntry);
    }));
  },

  convertToSortedValueSet(val) {
    if (_.isArray(val)) {
      return _.map(val, this.convertToSortedValueSet.bind(this));
    }
    else if (_.isObject(val)) {
      // make sure, entries in resulting string representation are sorted by key
      const converted = _.flatten(_.map(val, (v, k) => [k, this.convertToSortedValueSet(v)]));
      return _.sortBy(converted, ([k, v]) => k);
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
    // the cfg object supports some short-hands, which are unrolled in completeCfg
    const completeCfg = IndexUtils.sanitizeConfig(cfg);

    // create object of type { indexName => [ key1, key2...] }
    const keysByIndexName = _.zipObject(_.keys(completeCfg), _.map(completeCfg, 'keys'));

    // create object of type { key => [indexName1, indexName2...] }
    const indexNamesByKey = {};
    for (const indexName in keysByIndexName) {
      const keys = keysByIndexName[indexName];
      keys.forEach(key => 
        indexNamesByKey[key] = indexNamesByKey[key] && indexNamesByKey[key].push(indexName) || [indexName]);
    }

    this.cfg = completeCfg;

    this.indexNames = _.keys(keysByIndexName);
    this.keys = _.keys(indexNamesByKey);

    this.keysByIndexName = keysByIndexName;
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

  // whether the given key (or: child property) participates in any index
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
    // console.log({
    //   orderByChild: indexName,
    //   equalTo: queryValue
    // });
    return {
      orderByChild: indexName,
      equalTo: this.encodeQueryValueAll(query)
    };
  }

  encodeQueryValueAll(query) {
    const keys = _.keys(query);
    const indexName = this.getIndexNameByKeys(keys);
    if (!indexName) {
      throw new Error('invalid query - keys did not match any index: ' + JSON.stringify(query));
    }
    return this.encodeQueryValue(query, keys);
  }

  encodeQueryValue(val, keys) {
    if (!keys || !keys.length) {
      console.error('Invalid query: keys are empty.');
      return null;
    }
    if (keys.length == 1) {
      return IndexUtils.encodeValueDeep(val[keys[0]]);
    }
    const values = _.map(keys, key => val[key]);
    return IndexUtils.encodeValueDeep(values);
  }

  getCfg(indexName) {
    return this.cfg[indexName];
  }

  // update indices in given val before writing
  updateIndices(val) {
    if (!_.isObject(val)) return;
    
    for (var indexName in this.keysByIndexName) {
      const cfg = this.getCfg(indexName);
      if (cfg.writeAlways || !val[indexName]) {
        const keys = this.keysByIndexName[indexName];
        if (!cfg.autoUpdate) continue;
        if (keys.length < 2) continue;  // only need to handle composed keys

        if (_.some(keys, key => !_.has(val, key))) {
          if (this.cfg[indexName].isRequired) {
            console.warn(`Updated value did not define index "${indexName}", and is also missing some of its keys: 
              [${keys}]\n${JSON.stringify(val)}`);
          }
          continue;
        }

        val[indexName] = this.encodeQueryValue(val, keys);
      }
    }
  }
}