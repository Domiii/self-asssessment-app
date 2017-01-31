import React, { Component, PropTypes } from 'react';
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
    const { quiz } = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const title = quiz && quiz.title;

    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

        //<FormGroup role="form">
    return (
      <form onSubmit={onSubmit}>
        <div>
          <Field name="title" component="input" type="text" placeholder="new quiz title" />
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

const QuizInfoEditor = reduxForm({ form: 'quiz_editor' /* unique form name */})(_QuizInfoEditor);
export default QuizInfoEditor;