import { makeRefWrapper } from 'src/firebaseUtil';


// TODO: Likes + maybe some more responses toward entire concepts
/*
  like: {
    title_en: 'Like!',
    icon: 'heart',
    className: 'color-red',
    bsStyle: 'warning'
  },
*/

const ConceptResponsesRef = makeRefWrapper({
  pathTemplate: '/conceptResponses',

  indices: {
    uid: ['uid'],
    conceptId: ['conceptId'],
    uid_conceptId: {
      keys: ['uid', 'conceptId'],
      autoUpdate: false
    }
  },

  queryString({uid, conceptId}) {
    // get all responses by given uid + conceptId
    return this.indices.where({uid, conceptId});
  },

  methods: {
    updateTextResponse(text) {
      const { uid, conceptId } = this.props;
      if (!uid || !conceptId) {
        console.error("[ERROR] Missing `uid` or `conceptId` props in ConceptResponsesRef.");
        return Promise.resolve(null);
      }

      return this.setByIndex({uid, conceptId}, {
        uid,
        conceptId,
        text
      });
    }
  },

  children: {
    responses: {
      pathTemplate: '$(responseId)',

      children: {
        uid: 'uid',
        conceptId: 'conceptId',
        text: 'text'
      }
    }
  }
});

export default ConceptResponsesRef;