import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';


const ConceptProblemsRef = refWrapper({
  // the root path of all objects of this type
  path: '/conceptProblems',

  methods: {

  },

  children: {
    ofConcept: {
      path: '$(conceptId)',

      cascadingMethods: {
        updateKeepOrder(conceptId, updates) {
          // TODO: this.val and this.update_ofConcept don't work in cascading methods

          updates = updates || {};
          const problems = this.val;
          const ids = Object.keys(problems);
          debugger;
          const orderedIds = _.sortBy(ids, id => problems[id].num);
          updates = _.reduce(orderedIds, (updates, id, index) => {
            const newNum = 1+index;
            if (problems[id].num != newNum) {
              updates[id] = newNum;
            }
          }, updates);

          const numUpdates = _.keyBy(problems, (problem) => {});
          return this.update_ofConcept(conceptId, updates);
        },

        // TODO: update problem order
        updateProblemOrder(conceptId, problemId, problemData) {
          const updates = {
            [problemId]: problemData
          };
          return this.update_ofConcept(conceptId, updates);
          //return this.updateKeepOrder(conceptId, updates);
        },

        deleteProblem(conceptId, problemId) {
          return this.delete_problem(conceptId, problemId)
          .then(() => {
            // keep order after deleting
            //return this.updateKeepOrder(conceptId);
          });
        },

        getFirstProblem(conceptId) {
          const firstProblemId = this.getFirstProblemId(conceptId);
          return firstProblemId && this.problem(conceptId, firstProblemId);
        },

        getFirstProblemId(conceptId) {
          // TODO: Make this more efficient
          const problems = this.ofConcept(conceptId);
          if (!problems) {
            return null;
          }
          let firstNum = 99999999999;
          let firstKey = null;
          for (let key in problems) {
            const prob = problems[key];
            if (prob.num < firstNum) {
              firstNum = prob.num;
              firstKey = key;
            }
          }
          return firstKey;
        },

        getLastProblemId(conceptId) {
          // TODO: Make this more efficient
          const problems = this.ofConcept(conceptId);
          if (!problems) {
            return null;
          }
          let lastNum = -999999999;
          let lastKey = null;
          for (let key in problems) {
            const prob = problems[key];
            if (prob.num > lastNum) {
              lastNum = prob.num;
              lastKey = key;
            }
          }
          return lastKey;
        },

        getPreviousProblemId(conceptId, currentProblemId) {
          const problems = this.ofConcept(conceptId);
          if (!problems) {
            return null;
          }
          const currentProblem = this.problem(conceptId, currentProblemId);
          if (!currentProblem) {
            return this.getFirstProblemId(conceptId);
          }

          let newNum = -99999999999;
          let newKey = null;
          for (let key in problems) {
            const prob = problems[key];
            if (prob.num < currentProblem.num && prob.num > newNum) {
              newNum = prob.num;
              newKey = key;
            }
          }
          return newKey || this.getLastProblemId(conceptId);
        },

        getNextProblemId: function(conceptId, currentProblemId) {
          const problems = this.ofConcept(conceptId);
          if (!problems) {
            return null;
          }
          const currentProblem = this.problem(conceptId, currentProblemId);
          if (!currentProblem) {
            return this.getFirstProblemId(conceptId);
          }

          let newNum = 99999999999;
          let newKey = null;
          for (let key in problems) {
            const prob = problems[key];
            if (prob.num > currentProblem.num && prob.num < newNum) {
              newNum = prob.num;
              newKey = key;
            }
          }
          return newKey || this.getFirstProblemId(conceptId);
        }
      },

      children: {
        problem: {
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
});

export default ConceptProblemsRef;