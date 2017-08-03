/**
 * Groups are organized
 */


import { makeRefWrapper, m2mIndex } from 'src/firebaseUtil';
import { EmptyObject, EmptyArray } from 'src/util';

import UserInfoRef from 'src/core/users/UserInfoRef';

const GroupsRef = makeRefWrapper({
  pathTemplate: '/groups',

  methods: {

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


export const UserGroupIndex = m2mIndex((firebaseRoot) => [
  'userGroups',

  'user',
  'group',
  
  UserInfoRef(firebaseRoot),
  GroupsRef(firebaseRoot)
]);

export default GroupsRef;