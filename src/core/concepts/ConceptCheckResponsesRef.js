import { refWrapper } from 'src/firebaseUtil';
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
    uid_conceptId: ['uid', 'conceptId'],

    // cannot currently use updatedAt, since it is only set after query returns
    //conceptId_updatedAt: ['conceptId', 'updatedAt']
  },

  queryString({uid}) {
    // get all responses by given uid
    return this.indices.where({uid});
    // return this.indices.where({
    //   uid,
    //   conceptId
    // });
    // {
    //   orderByChild: 'uid',
    //   equalTo: uid
    // };
  },

  methods: {
    ofConcept(conceptId) {
      const { uid } = this.props;
      const q = {
        uid,
        conceptId
      };
      return this.val && _.filter(this.val, q) || EmptyArray;
    },

    updateResponse(conceptId, checkId, checkStillExists, responseName, response) {
      const { uid } = this.props;
      const responseId = this.val && _.findKey(this.val, {
        uid,
        conceptId,
        checkId
      });
      const previousResponse = !!responseId && this.val[responseId];
      const newStatus = !!previousResponse ? !previousResponse[responseName] : true;

      if (checkStillExists) {
        // check still exists
        const child = {
          uid,
          conceptId,
          checkId,
          [responseName]: newStatus,
          progress: newStatus && response.progress || 0
        };

        if (responseId) {
          //console.log(responseId, child);
          return this.setChild(responseId, child);
        }
        else {
          return this.push(child);
        }
        //return Promise.resolve(1);
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