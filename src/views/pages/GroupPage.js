import GroupsRef, { UserGroupRef } from 'src/core/groups/GroupsRef';
import UserInfoRef from 'src/core/users/UserInfoRef';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase'
import { 
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';

import autoBind from 'react-autobind';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { LoadOverlay } from 'src/views/components/overlays';

import GroupList from 'src/views/components/groups/GroupList';


@firebaseConnect((props, firebase) => {
  console.log(GroupsRef.makeQuery());
  const queries = [
    UserInfoRef.makeQuery(),
    GroupsRef.makeQuery()
  ];
  UserGroupRef.addIndexQueries(queries);
  return queries;
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

  render() {
    if (this.IsNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    return (
      <GroupList />
    );
  }
}

export default GroupPage;