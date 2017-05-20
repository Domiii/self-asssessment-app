import React, { Component } from 'react';

/*
        submissionId: 'submissionId',

        conceptId: 'conceptId',
        submitterId: 'submitterId',

        reviewerId: 'reviewerId',

        // feedback status
        status: 'status'

        text
        */
class _SubmissionFeedbackForm extends Component {
  render() {
    const { 
      handleSubmit, reset, pristine, submitting, values
    } = this.props;

    // actions
    function onSubmit(...args) {
      handleSubmit(...args);
      reset();
    };

        // TODO: add all above fields
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <Field name="text" component="textarea" rows="10" style={{width: '100%'}} />
      </form>
    );
  }
}


_SubmissionFeedbackForm = reduxForm({ enableReinitialize: true })(_SubmissionFeedbackForm);

const SubmissionFeedbackForm = connect(
  (state, { feedback }) => {
    return ({
      form: 'feedback_' + conceptId,
      initialValues: {
        feedback
      },
    });
  }
)(_SubmissionFeedbackForm);

export default SubmissionFeedbackForm;