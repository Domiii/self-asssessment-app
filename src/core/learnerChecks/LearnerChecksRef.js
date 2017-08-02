import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';
import { EmptyObject, EmptyArray } from 'src/util';


const LearnerChecksRef = makeRefWrapper({
  pathTemplate: '/learnerCheck',

  indices: {

  },

  queryString({uid}) {
    // get all responses by given uid
    return this.indices.where({uid});
  },

  methods: {
    
  },

  children: {
    response: {
      pathTemplate: '$(checkId)',

      children: {
        uid: 'uid',
        gid: 'gid',
        conceptId: 'conceptId',
        checkId: 'checkId',
        //progress: 'progress',
        done: 'done'
        // selected: {
        //   pathTemplate: 'selected',

        //   children: {
        //     statusUpdate: 'statusUpdate',
        //     feedback: 'feedback',
        //     request: 'request',
        //   }
        // }
      }
    }
  }
});

export default LearnerChecksRef;