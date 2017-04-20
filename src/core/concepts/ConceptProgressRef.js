import { refWrapper } from 'src/firebaseUtil';


const ConceptProgressRef = refWrapper({
  pathTemplate: '/conceptProgress',

  children: {
    ofUser: {
      pathTemplate: '$(uid)',

      children: {
        ofConcept: {
          pathTemplate: '$(conceptId)',

          children: {
            currentProblemId: 'currentProblemId'
          }
        }
      }
    }
  }
});

export default ConceptProgressRef;