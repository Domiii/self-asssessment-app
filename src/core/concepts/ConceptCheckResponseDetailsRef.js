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

const ConceptCheckResponseDetailsRef = refWrapper({
  pathTemplate: '/conceptCheckResponseDetails',

  indices: {
    uid: ['uid'],
    conceptId: ['conceptId'],
    uid_conceptId: ['uid', 'conceptId']
  },

  queryString({uid, conceptId}) {
    // get all responses by given uid + conceptId
    return this.indices.where({uid, conceptId});
  },

  methods: {
  },

  children: {
    responses: {
      pathTemplate: '$(responseDetailId)',

      children: {
        uid: 'uid',
        conceptId: 'conceptId',
        checkId: 'checkId',
        text: 'text'
      }
    }
  }
});

export default ConceptCheckResponseDetailsRef;