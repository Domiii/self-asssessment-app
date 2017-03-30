import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';

const ConceptChecksRef = refWrapper({
  pathTemplate: '/conceptChecks',

  children: {
    ofUser: {
      pathTemplate: '$(uid)',

      children: {
        ofConcept: {
          pathTemplate: '$(conceptId)',

          children: {
            conceptCheck: {
              pathTemplate: '$(conceptCheckId)',

              children: {
                title_en: 'title_en',
                title_zh: 'title_zh',
                responseTypeId: 'responseTypeId'
              }
            }
          }
        }
      }
    }
  }
});

export default ConceptChecksRef;