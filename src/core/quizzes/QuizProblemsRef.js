import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';


const QuizProblemsRef = refWrapper({
  // the root of all objects of this type
  path: '/quizProblems',

  methods: {

  },

  children: {
    ofQuiz: {
      path: '$(quizId)',

      cascadingMethods: {
        getFirstProblem(quizId) {
          const firstId = this.getFirstProblemId(quizId);
          return firstId && this.getProblems(quizId)[firstId];
        },

        getFirstProblemId(quizId) {
          const problems = this.getProblems(quizId);
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
          const problems = this.getProblems(quizId);
          // TODO
        },

        getNextProblemId(quizId, currentProblemId) {
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