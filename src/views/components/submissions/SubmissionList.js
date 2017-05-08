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

    const list = _.sortBy(submissions, entry => -entry.updatedAt);

    const entryEls = _.map(list, (submission, id) => 
      <SubmissionEntry key={id} {...submission} />
    );

    return (
      <ListGroup>
        {entryEls}
      </ListGroup>
    );
  }
}