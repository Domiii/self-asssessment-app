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

          methods: {
            updateResponse(checkId, responseName, response) {
              const currentResponse = this.response(checkId);
              const newStatus = !!currentResponse ? !currentResponse[responseName] : true;

              return this.update_response(checkId, {
                [responseName]: newStatus
              });
            }
          },

          children: {
            response: {
              pathTemplate: '$(checkId)',

              children: {
                //progress: 'progress'
              }
            }
          }
        }
      }
    }
  }
});

export default ConceptCheckResponsesRef;