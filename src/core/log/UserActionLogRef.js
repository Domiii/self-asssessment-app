import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';


export const UserActionLogRef = makeRefWrapper({
  pathTemplate: '/logs/userActions',

  updatedAt: null,

  children: {
    entry: {
      pathTemplate: '$(uid)/$(updatedAt)',

      children: {
        action: 'action',
        args: 'args'
      }
    }
  }
});