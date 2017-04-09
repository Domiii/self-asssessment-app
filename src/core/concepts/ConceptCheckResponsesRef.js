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
        updateResponse(conceptId, checkId, checkStillExists, responseName, response) {
          const currentResponse = this.response(conceptId, checkId);
          const newStatus = !!currentResponse ? !currentResponse[responseName] : true;

          if (checkStillExists) {
            return this.update_response(conceptId, checkId, {
              [responseName]: newStatus,
              progress: newStatus && response.progress || 0
            });
          }
          else if (!newStatus) {
            return this.delete_response(conceptId, checkId);
          }
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