import { refWrapper } from 'src/firebaseUtil';
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