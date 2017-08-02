/**
 * Teams are self-organized entities of users
 */


import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';
import { EmptyObject, EmptyArray } from 'src/util';

const TeamsRef = makeRefWrapper({
  pathTemplate: '/teams',

  methods: {

  },

  children: {
    team: {
      pathTemplate: '$(teamId)',

      children: {
        users: 'users'
      }
    }
  }
});

export default TeamsRef;