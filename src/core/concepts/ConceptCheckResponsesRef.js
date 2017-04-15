import { refWrapper } from 'src/util/firebaseUtil';
import 


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
  pathTemplate: '/conceptCheckResponses',

  indices: {
    uid: ['uid'],
    conceptId: ['conceptId'],
    conceptId_updatedAt: ['conceptId', 'updatedAt']
  },

  queryString(query) {
    // uid

    if (ownerId) {
      // get all entries of given parent
      return {
        orderByChild: 'ownerId',
        equalTo: ownerId
      };
    }
    else {
      // get root entries
      return {
        orderByChild: 'parentId',
        equalTo: null
      };
    }
  },

  methods: {
    updateResponse(uid, conceptId, checkId, checkStillExists, responseName, response) {
      const currentResponse = this.response(conceptId, checkId);
      const newStatus = !!currentResponse ? !currentResponse[responseName] : true;

      if (checkStillExists) {
        //return this.update_response(conceptId, checkId, {
          return this.set_response(conceptId, checkId, {
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
    responses: {
      pathTemplate: '$(responseId)',

      children: {
        progress: 'progress'
      }
    }
  }
});

export default ConceptCheckResponsesRef;