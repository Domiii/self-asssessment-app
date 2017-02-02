import { refWrapper } from 'src/util/firebaseUtil';


const ProblemResponsesRef = refWrapper({
  path: '/conceptProblemResponses',

  children: {
    ofConcept: {
      path: '$(uid)/$(conceptId)',
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