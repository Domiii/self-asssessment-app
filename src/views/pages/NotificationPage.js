import {
  NotificationsRef
}
from 'src/core/log';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { 
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { LoadOverlay } from 'src/views/components/overlays';
import { NotificationList } from 'src/views/components/notifications';

import { firebase as firebaseConnect } from 'redux-react-firebase'

import _ from 'lodash';
import autoBind from 'react-autobind';


@firebaseConnect((props, firebase) => {
  return [
    NotificationsRef.makeQuery()
  ];
})
@connect(({ firebase }, props) => {
  return {
    notificationsRef: NotificationsRef(firebase)
  };
})
class NotificationPage extends Component {
  static propTypes = {
    notificationsRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  get isNotLoadedYet() {
    const { notificationsRef } = this.props;
    return !notificationsRef.isLoaded;
  }

  get currentNotifications() {
    const { notificationsRef } = this.props;
    return notificationsRef.val;
  }

  render() {
    if (this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    const { notificationsRef } = this.props;

    if (!this.currentNotifications) {
      return (
        <Alert bsStyle="warning">
          <span>there are no notifications</span>
        </Alert>
      );
    }

    return (
      <NotificationList notifications={this.currentNotifications} />
    );
  }
}

export default NotificationPage;