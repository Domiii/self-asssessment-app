import React, { Component, PropTypes } from 'react';
import SubmissionEntry from './SubmissionEntry';
import SubmissionFeedbackList from './SubmissionFeedbackList';
import {
  ListGroup
} from 'react-bootstrap';

export default class SubmissionList extends Component {
  static propTypes = {
    submissions: PropTypes.object.isRequired,
    feedbacks: PropTypes.object,
    addFeedback: PropTypes.func,
    updateFeedback: PropTypes.func
  };

  render() {
    const { 
      submissions,
      feedbacks,
      addFeedback,
      updateFeedback
    } = this.props;
    
    const ids = _.map(submissions, (_, id) => id);
    const sortedIds = _.sortBy(ids, id => -submissions[id].updatedAt);
    const styles = {
      display: 'flex',
      flex: '2 50%'
    };

    const entryEls = _.map(sortedIds, submissionId => {
      const submission = submissions[submissionId];
      return (
        <div key={submissionId} style={styles}>
          <SubmissionEntry {...{
            submissionId,
            submission
          }} />
          <SubmissionFeedbackList {...{
            submissionId,
            submission,
            feedbacks,
            addFeedback,
            updateFeedback
          }} />
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