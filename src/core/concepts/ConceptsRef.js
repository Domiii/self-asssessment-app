import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';
import ConceptBase from './ConceptBase';

const ConceptsRef = refWrapper(_.merge(ConceptBase, {
  path: '/concepts'
});

export default ConceptsRef;