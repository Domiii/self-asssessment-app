/**
 * Groups are organized
 */


import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';
import { EmptyObject, EmptyArray } from 'src/util';

const GroupsRef = makeRefWrapper({
  pathTemplate: '/groups',

  methods: {

  },

  children: {
    group: {
      pathTemplate: '$(groupId)',

      children: {
        users: 'users'
      }
    }
  }
});

export default GroupsRef;