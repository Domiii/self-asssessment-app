import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';


const QuizProblemsRef = refWrapper({
  // the root path of all objects of this type
  path: '/quizProblems',

  methods: {

  },

  children: {
    ofQuiz: {
      path: '$(quizId)',

      cascadingMethods: {
        updateKeepOrder(quizId, updates) {
          // TODO: this.val and this.update_ofQuiz don't work in cascading methods

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
          return this.update_ofQuiz(quizId, updates);
        },

        // TODO: update problem order
        updateProblemOrder(quizId, problemId, problemData) {
          const updates = {
            [problemId]: problemData
          };
          return this.update_ofQuiz(quizId, updates);
          //return this.updateKeepOrder(quizId, updates);
        },

        deleteProblem(quizId, problemId) {
          return this.delete_problem(quizId, problemId)
          .then(() => {
            // keep order after deleting
            //return this.updateKeepOrder(quizId);
          });
        },

        getFirstProblem(quizId) {
          const firstProblemId = this.getFirstProblemId(quizId);
          return firstProblemId && this.problem(quizId, firstProblemId);
        },

        getFirstProblemId(quizId) {
          // TODO: Make this more efficient
          const problems = this.ofQuiz(quizId);
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

        getLastProblemId(quizId) {
          // TODO: Make this more efficient
          const problems = this.ofQuiz(quizId);
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

        getPreviousProblemId(quizId, currentProblemId) {
          const problems = this.ofQuiz(quizId);
          if (!problems) {
            return null;
          }
          const currentProblem = this.problem(quizId, currentProblemId);
          if (!currentProblem) {
            return this.getFirstProblemId(quizId);
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
          return newKey || this.getLastProblemId(quizId);
        },

        getNextProblemId: function(quizId, currentProblemId) {
          const problems = this.ofQuiz(quizId);
          if (!problems) {
            return null;
          }
          const currentProblem = this.problem(quizId, currentProblemId);
          if (!currentProblem) {
            return this.getFirstProblemId(quizId);
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
          return newKey || this.getFirstProblemId(quizId);
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

export default QuizProblemsRef;