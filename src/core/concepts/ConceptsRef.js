import { refWrapper } from 'src/util/firebaseUtil';

const ConceptsRef = refWrapper({
  path: '/concepts',

  children: {
    concept: {
      path: '$(conceptId)',
    }
  }
});

export default ConceptsRef;