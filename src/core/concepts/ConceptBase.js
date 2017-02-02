import _ from 'lodash';

const ConceptBase = {
  methods: {

  },

  children: {
    ofParent: {
      path: '$(parentId)',

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

        // TODO: update problem order
        updateOrder(parentId, problemId, problemData) {
          const updates = {
            [problemId]: problemData
          };
          return this.update_ofConcept(parentId, updates);
          //return this.updateKeepOrder(parentId, updates);
        },

        deleteChild(parentId, problemId) {
          return this.delete_problem(parentId, problemId)
          .then(() => {
            // keep order after deleting
            //return this.updateKeepOrder(parentId);
          });
        },

        getFirstProblem(parentId) {
          const firstProblemId = this.getFirstProblemId(parentId);
          return firstProblemId && this.problem(parentId, firstProblemId);
        },

        getFirstProblemId(parentId) {
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

        getLastProblemId(parentId) {
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

        getPreviousProblemId(parentId, currentProblemId) {
          const concepts = this.ofConcept(parentId);
          if (!concepts) {
            return null;
          }
          const currentProblem = this.problem(parentId, currentProblemId);
          if (!currentProblem) {
            return this.getFirstProblemId(parentId);
          }

          let newNum = -99999999999;
          let newKey = null;
          for (let key in concepts) {
            const prob = concepts[key];
            if (prob.num < currentProblem.num && prob.num > newNum) {
              newNum = prob.num;
              newKey = key;
            }
          }
          return newKey || this.getLastProblemId(parentId);
        },

        getNextProblemId: function(parentId, currentProblemId) {
          const concepts = this.ofConcept(parentId);
          if (!concepts) {
            return null;
          }
          const currentProblem = this.problem(parentId, currentProblemId);
          if (!currentProblem) {
            return this.getFirstProblemId(parentId);
          }

          let newNum = 99999999999;
          let newKey = null;
          for (let key in concepts) {
            const prob = concepts[key];
            if (prob.num > currentProblem.num && prob.num < newNum) {
              newNum = prob.num;
              newKey = key;
            }
          }
          return newKey || this.getFirstProblemId(parentId);
        }
      },

      children: {
        childConcepts: {
          path: '$(problemId)',

          children: {
            title_en: 'title_en',
            title_zh: 'title_zh',
            description_en: 'description_en',
            description_zh: 'description_zh'
          }
        }
      }
    }
  }
};

export default ConceptBase;