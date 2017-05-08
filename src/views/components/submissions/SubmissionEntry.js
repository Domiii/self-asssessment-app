'use strict';

import React, { Component, PropTypes } from 'react';
import Moment from 'react-moment';
import {
  ListGroup, ListGroupItem
} from 'react-bootstrap';
import { FAIcon } from 'src/views/components/util';

export default class SubmissionEntry extends Component {
  static propTypes = {
    submission: PropTypes.object.isRequired
  };

  render() {
    const { 
      submission: {
        uid,
        conceptId,
        text,
        hasSubmitted,
        updatedAt
      }
    } = this.props;

    // TODO: Need to get submission-related data
    //    uid => user name
    //    conceptId => concept title?

    return (
      <li className="list-group-item">
        <h4 className="list-group-item-heading">
          { hasSubmitted &&
            <FAIcon name="done" className="color-green" /> ||  
            <FAIcon name="remove" className="color-red" />}
          {`Submission for ${conceptId}`} by ${uid}`}
        </h4>
        <Moment fromNow>{updatedAt}</Moment> (<Moment format="MMMM Do YYYY, h:mm:ss a">{updatedAt}</Moment>)
        <pre className="list-group-item-text">
          { text }
        </pre>
      </li>
    );
  }
}