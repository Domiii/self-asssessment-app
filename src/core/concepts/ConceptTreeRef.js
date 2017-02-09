import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';

const ConceptTreeRef = refWrapper({
  pathTemplate: '/conceptTree',

  methods: {

  },

  children: {
    ofConcept: {
      pathTemplate: '$(ownerId)'
    }
  }
});

export default ConceptTreeRef;