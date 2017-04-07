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
      methods: {
        updateResponse(conceptId, checkId, responseName, response) {
          const currentResponse = this.response(conceptId, checkId);
          const newStatus = !!currentResponse ? !currentResponse[responseName] : true;

          return this.update_response(conceptId, checkId, {
            [responseName]: newStatus,
            progress: newStatus && response.progress || 0
          });
        }
      },

      children: {

        ofConcept: {
          pathTemplate: '$(conceptId)',

          children: {
            response: {
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