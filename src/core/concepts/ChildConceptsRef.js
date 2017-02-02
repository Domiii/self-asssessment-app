import { refWrapper } from 'src/util/firebaseUtil';

const ConceptChildrenRef = refWrapper({
  path: '/conceptChildren',

  children: {
    concept: {
      path: '$(conceptId)',
    }
  }
});

export default ConceptChildrenRef;