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

  // children: {
  //   ofConcept: {
  //     pathTemplate: '$(uid)/$(conceptId)',
  //     children: {
  //       response: {
  //         pathTemplate: '$(problemId)',
  //         children: {
  //           understanding: 'understanding'
  //         }
  //       }
  //     }
  //   }
  // }
});

export default ConceptResponsesRef;