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
      autoUpdate: false,
      forceSimpleEncoding: true
    }
  },


  queryString(args) {
    const limit = args && args.limit;
    const filter = args && args.filter;
    const populates = args && args.populates;

    const q = {
      queryParams: []
    };

    if (limit) {
      q.queryParams.push(`limitToLast=${limit}`);
    }

    if (filter && filter.length) {
      //console.log('filter: ' + JSON.stringify(filter));
      q.queryParams.push(
        `orderByChild=${filter[0]}`,
        `equalTo=${filter[1]}`
      );
    }

    if (populates) {
      q.populates = populates;
    }

    return q;
  },

  children: {
    response: {
      pathTemplate: '$(responseId)',

      methods: {
        updateTextResponse(givenConceptId, response) {
          const { uid, conceptId } = this.props;

          // sanity checks
          if (!uid || !conceptId) {
            return Promise.reject(new Error("[ERROR] Missing `uid` or `conceptId` props in ConceptResponsesRef."));
          }

          if (givenConceptId != conceptId) {
            return Promise.reject(new Error(`[ERROR] Invalid "conceptId" given in ConceptResponsesRef: ${givenConceptId} - expected: ${conceptId}`));
          }

          //return this.setByIndex({uid, conceptId}, {
          return this.update({
            uid,
            conceptId,
            ...response
          });
        }
      },

      children: {
        uid: 'uid',
        conceptId: 'conceptId',
        text: 'text',

        // whether the user has already clicked the "submit" button
        hasSubmitted: 'hasSubmitted'
      }
    }
  }
});

export default ConceptResponsesRef;