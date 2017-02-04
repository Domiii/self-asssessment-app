import _ from 'lodash';

const ConceptBase = {
  cascadingMethods: {
    updateKeepOrder(parentId, updates) {
      // TODO: this.val and this.update_ofConcept don't work in cascading methods

      updates = updates || {};
      const concepts = this.val;
      const ids = Object.keys(concepts);
      debugger;
      const orderedIds = _.sortBy(ids, id => concepts[id].num);
      updates = _.reduce(orderedIds, (updates, id, index) => {
        const newNum = 1+index;
        if (concepts[id].num != newNum) {
          updates[id] = newNum;
        }
      }, updates);

      const numUpdates = _.keyBy(concepts, (concept) => {});
      return this.update_ofConcept(parentId, updates);
    },

    // TODO: update concept order
    updateOrder(parentId, conceptId, conceptData) {
      const updates = {
        [conceptId]: conceptData
      };
      return this.update_ofConcept(parentId, updates);
      //return this.updateKeepOrder(parentId, updates);
    },

    deleteChild(parentId, conceptId) {
      return this.delete_concept(parentId, conceptId)
      .then(() => {
        // keep order after deleting
        //return this.updateKeepOrder(parentId);
      });
    },

    getFirstChild(parentId) {
      const firstChildId = this.getFirstChildId(parentId);
      return firstChildId && this.concept(parentId, firstChildId);
    },

    getFirstChildId(parentId) {
      // TODO: Make this more efficient
      const concepts = this.ofConcept(parentId);
      if (!concepts) {
        return null;
      }
      let firstNum = 99999999999;
      let firstKey = null;
      for (let key in concepts) {
        const prob = concepts[key];
        if (prob.num < firstNum) {
          firstNum = prob.num;
          firstKey = key;
        }
      }
      return firstKey;
    },

    getLastChildId(parentId) {
      // TODO: Make this more efficient
      const concepts = this.ofConcept(parentId);
      if (!concepts) {
        return null;
      }
      let lastNum = -999999999;
      let lastKey = null;
      for (let key in concepts) {
        const prob = concepts[key];
        if (prob.num > lastNum) {
          lastNum = prob.num;
          lastKey = key;
        }
      }
      return lastKey;
    },

    getPreviousChildId(parentId, currentChildId) {
      const concepts = this.ofConcept(parentId);
      if (!concepts) {
        return null;
      }
      const currentChild = this.concept(parentId, currentChildId);
      if (!currentChild) {
        return this.getFirstChildId(parentId);
      }

      let newNum = -99999999999;
      let newKey = null;
      for (let key in concepts) {
        const prob = concepts[key];
        if (prob.num < currentChild.num && prob.num > newNum) {
          newNum = prob.num;
          newKey = key;
        }
      }
      return newKey || this.getLastChildId(parentId);
    },

    getNextChildId: function(parentId, currentChildId) {
      const concepts = this.ofConcept(parentId);
      if (!concepts) {
        return null;
      }
      const currentChild = this.concept(parentId, currentChildId);
      if (!currentChild) {
        return this.getFirstChildId(parentId);
      }

      let newNum = 99999999999;
      let newKey = null;
      for (let key in concepts) {
        const prob = concepts[key];
        if (prob.num > currentChild.num && prob.num < newNum) {
          newNum = prob.num;
          newKey = key;
        }
      }
      return newKey || this.getFirstChildId(parentId);
    }
  },

  children: {
    children: {
      path: '$(conceptId)',

      children: {
        title_en: 'title_en',
        title_zh: 'title_zh',
        description_en: 'description_en',
        description_zh: 'description_zh'
      }
    }
  }
};

export default ConceptBase;