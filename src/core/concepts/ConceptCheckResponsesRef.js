import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';
import { EmptyObject, EmptyArray } from 'src/util';

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

  queryString(uid) {
    // get all responses by given uid
    return {
      orderByChild: 'uid',
      equalTo: uid
    };
  },

  methods: {
    ofConcept(conceptId) {
      const { uid } = this.props;
      const q = {
        uid,
        conceptId
      };
      return this.val && _.find(this.val, q) || EmptyArray;
    },

    updateResponse(conceptId, checkId, checkStillExists, responseName, response) {
      const { uid } = this.props;
      const responseId = this.val && _.findKey(this.val, {
        uid,
        conceptId,
        checkId
      });
      const currentResponse = !!responseId && this.val[responseId];
      const newStatus = !!currentResponse ? !currentResponse[responseName] : true;

      if (checkStillExists) {
        // check is still there
        //return this.update_response(conceptId, checkId, {
        return this.setChild(responseId, {
          uid,
          conceptId,
          checkId,
          [responseName]: newStatus,
          progress: newStatus && response.progress || 0
        });
      }
      else if (!newStatus) {
        // check object is gone -> delete response
        return this.setChild(responseId, null);
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