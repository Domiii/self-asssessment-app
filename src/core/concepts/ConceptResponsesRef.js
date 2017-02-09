import { refWrapper } from 'src/util/firebaseUtil';


const ConceptResponsesRef = refWrapper({
  pathTemplate: '/conceptResponses',

  children: {
    ofConcept: {
      pathTemplate: '$(uid)/$(conceptId)',
      children: {
        response: {
          pathTemplate: '$(problemId)',
          children: {
            understanding: 'understanding'
          }
        }
      }
    }
  }
});

export default ConceptResponsesRef;