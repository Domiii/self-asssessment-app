import React, { Component, PropTypes } from 'react';
import GroupView from './GroupView';
import {
  ListGroup, ListGroupItem
} from 'react-bootstrap';

import GroupsRef, { UserGroupRef } from 'src/core/groups/GroupsRef';


@connect({({ firebase }, props) => {
  const userGroupRef = UserGroupRef(firebase);
  const userRef = userGroupRef.refs.user;
  const groupRef = userGroupRef.refs.group;

  return {
    // userInfoRef: UserInfoRef(firebase),
    // groupsRef,
    userRef,
    groupRef,
    userGroupRef,
    
    getUsersByGroup: userGroupRef.get_user_by_group,
    addUserToGroup: userGroupRef.addEntry,
    removeUserFromGroup: userGroupRef.removeEntry
  };
})
export default class GroupList extends Component {
  static propTypes = {
    groups: PropTypes.object.isRequired,
    //users: PropTypes.object.isRequired,

    getUsersByGroup: PropTypes.func.isRequired,
    addUserToGroup: PropTypes.func.isRequired,
    removeUserFromGroup: PropTypes.func.isRequired
  };

  render() {
    const { 
      groups,

      //userInfoRef,
      //groupsRef,

      addGroup,
      updateGroup,
      removeGroup,

      getUsersByGroup,

      addUserToGroup,
      removeUserFromGroup
    } = this.props;

    const list = _.sortBy(groups, group => -group.updatedAt);

    const groupEls = _.map(list, (group, id) => 
      <GroupView key={id + ''} 
        {...{
          group,
          groupsRef,
          getUsersByGroup,
          addUserToGroup,
          removeUserFromGroup
        }} />
    );

    return (
      <ListGroup>
        {groupEls}
      </ListGroup>
    );
  }
}