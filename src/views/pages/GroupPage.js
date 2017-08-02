import {
  GroupsRef
}
from 'src/core/groups';

import _ from 'lodash';

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


@firebaseConnect((props, firebase) => {
  return [
    GroupsRef.makeQuery({filter: props.route.filter})
  ];
})
@connect(({ firebase }, props) => {
  return {
    groupsRef: GroupsRef(firebase)
  };
})
class GroupPage extends Component {
  static propTypes = {
    groupsRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  get isNotLoadedYet() {
    const { groupsRef } = this.props;
    return !groupsRef.isLoaded;
  }

  get allGroups() {
    const { groupsRef } = this.props;
    return groupsRef.val;
  }

  render() {
    if (this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (!this.allGroups) {
      return (
        <Alert bsStyle="warning">
          <span>there are no groups</span>
        </Alert>
      );
    }

    return (
      <GroupList  
        groups={this.allGroups} />
    );
  }
}

export default GroupPage;