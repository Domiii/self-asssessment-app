import { refWrapper } from 'src/util/firebaseUtil';

const QuizzesRef = refWrapper({
  path: '/quizzes',

  children: {
    quiz: {
      path: '$(quizId)',
    }
  }
});

export default QuizzesRef;