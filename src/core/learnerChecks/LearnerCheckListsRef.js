/**
 * A list assigned to a given group, team or user
 */


import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';
import { EmptyObject, EmptyArray } from 'src/util';

const LearnerCheckListsRef = makeRefWrapper({
  pathTemplate: '/learnerCheckLists',

  methods: {

  },

  children: {
    list: {
      pathTemplate: '$(listId)',

      children: {
        templateId: 'templateId',
        uid: 'uid',
        groupId: 'groupId',
        teamId: 'teamId'
      }
    }
  }
});

export default LearnerCheckListsRef;