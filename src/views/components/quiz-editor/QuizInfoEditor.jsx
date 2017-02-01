import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Alert, Button, Jumbotron, Well, FormGroup } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { SimpleGrid, FAIcon } from 'src/views/components/util';
import _ from 'lodash';

//  see: http://redux-form.com/6.4.1/examples/simple/
class _QuizInfoEditor extends Component {
  static propTypes = {
    quiz: PropTypes.object
  };

  constructor(...args) {
    super(...args);
  }

  render() {
    const { quizId, quiz } = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props;

    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

        //<FormGroup role="form">
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <div>
          <Field name="quizId" value={quizId} component="input" type="hidden" />
          <Field name="quiz.title_en" component="input" type="text" placeholder="quiz title (EN)" />
          <Field name="quiz.title_zh" component="input" type="text" placeholder="quiz title (中文)" />
          <span className="margin-half" /> 
          <Button type="submit" bsStyle="success" bsSize="small" disabled={pristine || submitting}>
            {(!quiz ?
              (<span>
                <FAIcon name="plus" className="color-green" />
                add new quiz
              </span>):
              (<span>
                <FAIcon name="upload" className="color-green" />
                save
              </span>)
            )}
          </Button>
        </div>
      </form>
    );
  }
}

_QuizInfoEditor = reduxForm({ enableReinitialize: true })(_QuizInfoEditor);

const QuizInfoEditor = connect(
  (state, { quizId, quiz }) => {
    return ({
      form: 'quiz_editor_' + quizId,
      initialValues: {
        quizId,
        quiz: quiz || {}
      },
    });
  }
)(_QuizInfoEditor);

export default QuizInfoEditor;