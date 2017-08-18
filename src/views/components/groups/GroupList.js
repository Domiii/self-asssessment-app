import isEmpty from 'lodash/isEmpty';

import GroupsRef, { UserGroupRef } from 'src/core/groups/GroupsRef';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import {
  Button, ListGroup, ListGroupItem, Alert
} from 'react-bootstrap';
import { FAIcon } from 'src/views/components/util';

import GroupView from './GroupView';
import GroupEditor from './GroupEditor';


@connect(({ firebase }, props) => {
  const userGroupRef = UserGroupRef(firebase);
  const userRef = userGroupRef.refs.user;
  const groupsRef = userGroupRef.refs.group;

  return {
    // userInfoRef: UserInfoRef(firebase),
    // groupsRef,
    //userRef,
    groupsRef: groupsRef && groupsRef.val,
    //userGroupRef,
    
    addGroup: groupsRef.push_group,
    updateGroup: groupsRef.update_group,
    deleteGroup: groupsRef.delete_group,

    getUsersByGroup: userGroupRef.get_user_by_group,
    findUnassignedUsers: userGroupRef.findUnassigned_user_entries,
    addUserToGroup: userGroupRef.addEntry,
    deleteUserFromGroup: userGroupRef.deleteEntry
  };
})
export default class GroupList extends Component {
  static contextTypes = {
    currentUserRef: PropTypes.object
  };

  static propTypes = {
    groups: PropTypes.object,
    //users: PropTypes.object.isRequired,

    addGroup: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,

    getUsersByGroup: PropTypes.func.isRequired,
    findUnassignedUsers: PropTypes.func.isRequired,
    addUserToGroup: PropTypes.func.isRequired,
    deleteUserFromGroup: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      adding: false
    };

    autoBind(this);
  }

  get IsAdmin() {
    const { currentUserRef } = this.context;
    return currentUserRef && currentUserRef.isAdminDisplayMode() || false;
  }

  get IsAdding() {
    return this.state.adding;
  }

  toggleAdding() {
    this.setState({
      adding: !this.IsAdding
    });
  }

  makeEditorHeader() {
    return !this.IsAdmin ? null : (
      <div>
        <Button active={this.IsAdding}
          bsStyle="success" bsSize="small" onClick={this.toggleAdding}>
          <FAIcon name="plus" className="color-green" /> add new group
        </Button>
      </div>
    );
  }

  makeGroupEditorEl(group, groupId, existingUsers, addableUsers) {
    if (!this.IsAdmin) {
      return null;
    }

    const {
        updateGroup,
        addUserToGroup,
        deleteUserFromGroup
      } = this.props;

    return (<GroupEditor {...{
      groupId,
      group,
      existingUsers,
      addableUsers,

      updateGroup: ({groupId, group}) => {
        return updateGroup(groupId, group);
      },
      addUserToGroup,
      deleteUserFromGroup
    }} />);
  }

  makeEmptyGroupsEl() {
    return (
      <Alert bsStyle="warning">
        <span>there are no groups</span>
      </Alert>
    );
  }

  makeGroupsList() {
    const list = _.sortBy(groups, group => -group.updatedAt);
    const addableUsers = findUnassignedUsers();

    return (<ListGroup> {
      _.map(list, (group, groupId) => {
        const existingUsers = getUsersByGroup(id);

        return (<GroupView key={groupId + ''} 
          {...{
            groupId,
            group,

            users: existingUsers,
            //groupsRef,

            addUserToGroup,
            deleteUserFromGroup,

            groupEditor: this.makeGroupEditorEl(group, groupId, 
              existingUsers, addableUsers)
          }} />);
      })
    } </ListGroup>);
  }

  render() {
    const { 
      groups,

      //userInfoRef,
      //groupsRef,

      addGroup,
      updateGroup,
      deleteGroup,

      getUsersByGroup,
      findUnassignedUsers,

      addUserToGroup,
      deleteUserFromGroup
    } = this.props;


    let groupListEl;
    if (isEmpty(groups)) {
      groupListEl = this.makeEmptyGroupsEl();
    }
    else {
      groupListEl = this.makeGroupsList();
    }

    return (<div>
      { this.makeEditorHeader() }
      { groupListEl }
    </div>);
  }
}