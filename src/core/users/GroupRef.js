import { makeRefWrapper } from 'src/firebaseUtil';

// access to the current user's info
const GroupRef = makeRefWrapper({
  pathTemplate: '/groups',

  children: {
    pathTemplate: '$(groupId)',

    children: {
      name: 'name'
    }
  }
});

export default GroupRef;