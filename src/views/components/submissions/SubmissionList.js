import React, { PureComponent, PropTypes } from 'react';
import SubmissionEntry from './SubmissionEntry';
import SubmissionFeedbackList from './SubmissionFeedbackList';
import {
  ListGroup
} from 'react-bootstrap';

export default class SubmissionList extends PureComponent {
  static propTypes = {
    submissions: PropTypes.object.isRequired,
    addFeedback: PropTypes.func,
    updateFeedback: PropTypes.func
  };

  render() {
    const { 
      submissions,
      addFeedback,
      updateFeedback
    } = this.props;
    
    const ids = _.map(submissions, (_, id) => id);
    const sortedIds = _.sortBy(ids, id => -submissions[id].updatedAt);
    const halfColumnStyles = {
      width: '50%'
    };

    const entryEls = _.map(sortedIds, submissionId => {
      const submission = submissions[submissionId];
      return (
        <div key={submissionId}>
          <SubmissionEntry style={halfColumnStyles} {...{
            submissionId,
            submission
          }} />
          {/*
          <SubmissionFeedbackList style={halfColumnStyles} {...{
            submissionId,
            submission,
            feedbacks: submission.feedbacks,
            addFeedback,
            updateFeedback
          }} />
          */}
        </div>
      );
    });

    return (
      <ListGroup>
        {entryEls}
      </ListGroup>
    );
  }
}