// basics
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

// lodash
import map from 'lodash/map';
import size from 'lodash/size';

// components
import {
  ListGroup, Alert, Button
} from 'react-bootstrap';
import { FAIcon } from 'src/views/components/util';
import SubmissionFeedbackEntry from './SubmissionFeedbackEntry';
import SubmissionFeedbackForm from './SubmissionFeedbackForm';

export default class SubmissionFeedbackList extends Component {
  static contextTypes = {
    userInfoRef: PropTypes.object
  };

  static propTypes = {
    submissionId: PropTypes.string.isRequired,
    submission: PropTypes.object.isRequired,
    feedbacks: PropTypes.object,
    addFeedback: PropTypes.func,
    updateFeedback: PropTypes.func
  };

  constructor(...args) {
    super(...args);

    this.state = {
      editMode: null
    };

    autoBind(this);
  }


  // ###########################################################
  // Basic getters
  // ###########################################################

  get isAdmin() {
    const { userInfoRef } = this.context;
    return userInfoRef && userInfoRef.adminDisplayMode() || false;
  }

  get hasFeedback() {
    const { feedbacks } = this.props;
    return feedbacks && size(feedbacks) > 0;
  }


  // ###########################################################
  // Edit modes
  // ###########################################################

  setEditMode(mode, feedbackId) {
    this.setState({editMode: mode, feedbackId});
  }

  toggleAdding() {
    this.setEditMode(this.isAdding() && null || 'add');
  }

  toggleEditing(feedbackId) {
    if (this.isEditing(feedbackId)) {
      this.setEditMode(null);
    }
    else {
      this.setEditMode('edit', feedbackId);
    }
  }

  isAdding() {
    return this.state.editMode === 'add';
  }

  isEditing(feedbackId) {
    return this.state.editMode === 'edit' && this.state.feedbackId === feedbackId;
  }


  // ###########################################################
  // Actions
  // ###########################################################

  addFeedback({status, text}) {
    const { addFeedback, submission } = this.props;
    const {
      submissionId, conceptId, uid
    } = submission;
    return () => {
      const newRef = addFeedback(submissionId, conceptId, uid, status, text);
      const feedbackId = newRef.key;
      this.setEditMode(edit, feedbackId);
    };
  }

  updateFeedback({feedbackId, status, text}) {
    const { updateFeedback } = this.props;
    return () => updateFeedback(feedbackId, status, text);
  }

  // ###########################################################
  // Child elements
  // ###########################################################

  ListEl() {
    const {
      feedbacks
    } = this.props;

    return (
      map(feedbacks, (feedback, feedbackId) => (<div key={feedbackId}>
        <SubmissionFeedbackEntry {...{
          feedbackId,
          feedback,

          toggleEditing: this.toggleEditing.bind(this, feedbackId)
        }}/>
        { this.EditFeedbackFormEl(feedbackId, feedback) }
      </div>))
    );
  }

  EmptyListEl() {
    return (<Alert bsStyle="warning">
      still waiting for feedback
    </Alert>);
  }

  AddFeedbackFormEl() {
    return !this.isAdding() ? null : (
      <SubmissionFeedbackForm {...{
        onSubmit: this.addFeedback,
        feedback: {}
      }} />
    );
  }

  EditFeedbackFormEl(feedbackId, feedback) {
    return !this.isEditing(feedbackId) ? null : (
      <SubmissionFeedbackForm {...{
        onSubmit: this.updateFeedback,
        feedbackId,
        feedback
      }} />
    );
  }

  AddButtonEl() { 
    return this.isAdmin && (
      <Button block
        bsSize="small"
        bsStyle="success"
        onClick={this.toggleAdding}
      >
        <FAIcon name="plus" /> add feedback
      </Button>
    );
  }


  // ###########################################################
  // render
  // ###########################################################

  render() {
    return (
      <ListGroup>
        { this.AddButtonEl() }
        { this.AddFeedbackFormEl() }
        { this.hasFeedback && this.ListEl() || this.EmptyListEl() }
      </ListGroup>
    );
  }
};