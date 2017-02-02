import { refWrapper } from 'src/util/firebaseUtil';


const ConceptResponsesRef = refWrapper({
  path: '/conceptResponses',

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

export default ConceptResponsesRef;