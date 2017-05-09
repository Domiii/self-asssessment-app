'use strict';

import React, { Component, PropTypes } from 'react';
import SubmissionEntry from './SubmissionEntry';
import {
  ListGroup, ListGroupItem, Button
} from 'react-bootstrap';

export default class SubmissionList extends Component {
  static propTypes = {
    submissions: PropTypes.object.isRequired,
    loadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired
  };

  render() {
    const { 
      submissions,
      loadMore,
      hasMore
    } = this.props;

    const list = _.sortBy(submissions, item => -item.updatedAt);

    const entryEls = _.map(list, (submission, id) => {
      return (
        <SubmissionEntry key={id} {...{
          submissionId: id,
          submission
        }} />
      );
    });

    return (
      <div>
        <ListGroup>
          {entryEls}
        </ListGroup>
        <Button block
          bsStyle="primary"
          bsSize="large"
          onClick={loadMore}
          disabled={!hasMore}>
          Load more...
        </Button>
      </div>
    );
  }
}