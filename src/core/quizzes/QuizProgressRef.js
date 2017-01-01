import { refWrapper } from 'src/util/firebaseUtil';


const QuizProgressRef = refWrapper({
  path: '/quizProgress',

  children: {
    ofUser: {
      path: '$(uid)',

      children: {
        ofQuiz: {
          path: '$(quizId)',

          children: {
            currentProblemId: 'currentProblemId'
          }
        }
      }
    }
  }
});

export default QuizProgressRef;