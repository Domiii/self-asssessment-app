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
    ofUser: {
      pathTemplate: '$(uid)',
      children: {

        ofConcept: {
          pathTemplate: '$(conceptId)',
          children: {

            responses: {
              pathTemplate: '$(checkId)',
              children: {
                progress: 'progress'
              }
            }
          }
        }
      }
    }
  }
});

export default ConceptCheckResponsesRef;