'use strict';

import React, { Component, PropTypes } from 'react';
import Moment from 'moment';
import {
  ListGroup, ListGroupItem
} from 'react-bootstrap';

export default class NotificationEntry extends Component {
  static propTypes = {
    notification: PropTypes.object.isRequired
  };

  render() {
    const { 
      notification: {
        uid,
        type,
        updatedAt,
        args
      }
    } = this.props;

    // TODO: Need to get notification-related data
    //    uid => user name
    //    conceptId => concept title?

    return (
      <li className="list-group-item">
        <h4 className="list-group-item-heading">{`${type} by ${uid}`}</h4>
        <pre className="list-group-item-text">
          {JSON.stringify(args, null, 2)}
        </pre>
      </li>
    );
  }
}