import { refWrapper } from 'src/util/firebaseUtil';


const ConceptProgressRef = refWrapper({
  path: '/conceptProgress',

  children: {
    ofUser: {
      path: '$(uid)',

      children: {
        ofConcept: {
          path: '$(conceptId)',

          children: {
            currentProblemId: 'currentProblemId'
          }
        }
      }
    }
  }
});

export default ConceptProgressRef;