import { refWrapper } from 'src/util/firebaseUtil';


const ProblemResponsesRef = refWrapper({
  path: '/quizProblemResponses',

  children: {
    ofQuiz: {
      path: '$(uid)/$(quizId)',
      children: {
        response: {
          path: '$(problemId)',
          children: {
            understanding: 'understanding'
          }
        }
      }
    }
  }
});

export default ProblemResponsesRef;