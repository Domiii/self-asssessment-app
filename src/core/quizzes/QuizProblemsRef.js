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
          const firstId = this.getFirstProblemId(quizId);
          return firstId && this.ofQuiz(quizId)[firstId];
        },

        getFirstProblemId(quizId) {
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

        getPreviousProblemId(quizId, currentProblemId) {
          const problems = this.ofQuiz(quizId);
          // TODO
        },

        getNextProblemId: function(quizId, currentProblemId) {
          // TODO
        }
      },

      children: {
        problem: {
          path: '$(problemId)'
        }
      }
    }
  }
});

export default QuizProblemsRef;