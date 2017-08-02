import { GroupsRef } from 'src/core/groups';
import { UserInfoRef } from 'src/core/users';

// import _ from 'lodash';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase'
import { 
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';

import autoBind from 'react-autobind';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { LoadOverlay } from 'src/views/components/overlays';

import { GroupList } from 'src/views/components/groups';
import UserInfoRef from 'src/views/components/users/UserInfoRef';


@firebaseConnect((props, firebase) => {
  return [
    UserInfoRef.makeQuery({}),
    GroupsRef.makeQuery({})
  ];
})
@connect(({ firebase }, props) => {
  return {
    userInfoRef: UserInfoRef(firebase),
    groupsRef: GroupsRef(firebase)
  };
})
class GroupPage extends Component {
  static propTypes = {
    userInfoRef: PropTypes.object.isRequired,
    groupsRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  get IsNotLoadedYet() {
    const { groupsRef } = this.props;
    return !groupsRef.isLoaded;
  }

  get AllUsers() {
    const { userInfoRef } = this.props;
    return userInfoRef.val;
  }

  get AllGroups() {
    const { groupsRef } = this.props;
    return groupsRef.val;
  }

  render() {
    if (this.IsNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (!this.AllGroups) {
      return (
        <Alert bsStyle="warning">
          <span>there are no groups</span>
        </Alert>
      );
    }

    return (
      <GroupList
        users={this.AllUsers}
        groups={this.AllGroups} />
    );
  }
}

export default GroupPage;