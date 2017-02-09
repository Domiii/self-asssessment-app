import { refWrapper } from 'src/util/firebaseUtil';


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