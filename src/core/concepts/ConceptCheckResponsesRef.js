import { refWrapper } from 'src/util/firebaseUtil';


// TODO: Likes + maybe some more responses toward entire concepts
/*
  like: {
    title_en: 'Like!',
    icon: 'heart',
    className: 'color-red',
    bsStyle: 'warning'
  },
*/

const ConceptCheckResponsesRef = refWrapper({
  pathTemplate: '/conceptResponses',

  children: {
    ofConcept: {
      pathTemplate: '$(uid)/$(conceptId)',
      children: {
        response: {
          pathTemplate: '$(checkId)',
          // children: {
            
          // }
        }
      }
    }
  }
});

export default ConceptCheckResponsesRef;