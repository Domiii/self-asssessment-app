'use strict';

import React, { Component, PropTypes } from 'react';
import SubmissionEntry from './SubmissionEntry';
import {
  ListGroup, ListGroupItem
} from 'react-bootstrap';

export default class SubmissionList extends Component {
  static propTypes = {
    submissions: PropTypes.object.isRequired
  };

  render() {
    const { submissions } = this.props;

    const list = _.sortBy(submissions, item => -item.updatedAt);

    const entryEls = _.map(list, (submission, id) => {
      console.log(submission);
      return (
        <SubmissionEntry key={id} {...{
          submissionId: id,
          submission
        }} />
      );
    });

    return (
      <ListGroup>
        {entryEls}
      </ListGroup>
    );
  }
}