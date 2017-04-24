import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';


const UserActivityLogRef = makeRefWrapper({
  pathTemplate: '/logs/uiActivities',

  updatedAt: null,

  children: {
    entry: {
      pathTemplate: '$(uid)/$(updatedAt)',

      children: {
        page: 'page',
        args: 'args'
      }
    }
  }
});

export default UserActivityLogRef;