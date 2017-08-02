/**
 * Groups are organized
 */


import { makeRefWrapper } from 'src/firebaseUtil';
import { EmptyObject, EmptyArray } from 'src/util';

const GroupsRef = makeRefWrapper({
  pathTemplate: '/groups',

  methods: {

  },

  // TODO: need addUserToGroup + removeUserFromGroup methods!
  hasMany: {
    user: (usersRef) => usersRef
  },

  children: {
    group: {
      pathTemplate: '$(groupId)',

      children: {
        title: 'title'
      }
    }
  }
});

export default GroupsRef;