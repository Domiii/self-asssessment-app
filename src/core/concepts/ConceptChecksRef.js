import { refWrapper } from 'src/firebaseUtil';
import _ from 'lodash';

const ConceptChecksRef = refWrapper({
  pathTemplate: '/conceptChecks',

  children: {
    ofConcept: {
      pathTemplate: '$(conceptId)',

      children: {
        conceptCheck: {
          pathTemplate: '$(conceptCheckId)',

          children: {
            title_en: 'title_en',
            title_zh: 'title_zh',
            num: 'num',
            responseTypeId: 'responseTypeId'
          }
        }
      }
    }
  }
});

export default ConceptChecksRef;