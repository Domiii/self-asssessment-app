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
      const selector = {
        uid,
        conceptId
      };
      return this.val && _.filter(this.val, selector) || EmptyArray;
    },

    updateResponse(conceptId, checkId, checkStillExists, response) {
      const { uid } = this.props;
      const responseId = this.val && _.findKey(this.val, {
        uid,
        conceptId,
        checkId
      });
      const responseName = response.name;
      const categoryName = response.category;

      if (!this[categoryName]) {
        console.error(`Invalid categoryName "${categoryName}" in response "${responseName}"`);
        return Promise.resolve(null);
      }

      const currentSelection = responseId && this[categoryName](responseId);
      const isNowActive = !currentSelection || currentSelection !== responseName;

      if (checkStillExists) {
        // check still exists
        const newStatus = isNowActive ? responseName : null;
        const update = {};

        if (response.category === 'statusUpdate') {
          update.progress = isNowActive && response.progress || 0;
        }

        if (responseId) {
          // stupid -> update + push semantics are different.
          update[`selected/${categoryName}`] = newStatus;
          //console.log(responseId, update);
          return this.updateChild(responseId, update);
        }
        else {
          return this.push(Object.assign(update, {
            uid,
            conceptId,
            checkId,
            selected: {
              [categoryName]: newStatus
            }
          }));
        }
        //return Promise.resolve(1);
      }
      //else if (!isNowActive) {
      else {
        // check object is gone -> delete response
        return this.setChild(responseId, null);
      }
    }
  },

  children: {
    responses: {
      pathTemplate: '$(responseId)',

      children: {
        uid: 'uid',
        conceptId: 'conceptId',
        checkId: 'checkId',
        progress: 'progress',
        selected: {
          pathTemplate: 'selected',

          children: {
            statusUpdate: 'statusUpdate',
            feedback: 'feedback',
            request: 'request',
          }
        }
      }
    }
  }
});

export default ConceptCheckResponsesRef;