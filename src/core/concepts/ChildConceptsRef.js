import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';
import ConceptBase from './ConceptBase';

const ChildConceptsRef = refWrapper(_.merge(ConceptBase, {
  path: '/childConcepts/$(parentId)',

  methods: {

  },
}));

export default ChildConceptsRef;