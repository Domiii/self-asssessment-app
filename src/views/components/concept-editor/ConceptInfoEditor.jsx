import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Alert, Button, Jumbotron, Well, FormGroup } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { SimpleGrid, FAIcon } from 'src/views/components/util';
import _ from 'lodash';

//  see: http://redux-form.com/6.4.1/examples/simple/
class _ConceptInfoEditor extends Component {
  static propTypes = {
    concept: PropTypes.object
  };

  constructor(...args) {
    super(...args);
  }

  render() {
    const { conceptId, concept } = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props;

    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

        //<FormGroup role="form">
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <div>
          <Field name="conceptId" value={conceptId} component="input" type="hidden" />
          <Field name="concept.title_en" component="input" type="text" placeholder="concept title (EN)" />
          <Field name="concept.title_zh" component="input" type="text" placeholder="concept title (中文)" />
          <span className="margin-half" /> 
          <Button type="submit" bsStyle="success" bsSize="small" disabled={pristine || submitting}>
            {(!concept ?
              (<span>
                <FAIcon name="plus" className="color-green" />
                add new concept
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

_ConceptInfoEditor = reduxForm({ enableReinitialize: true })(_ConceptInfoEditor);

const ConceptInfoEditor = connect(
  (state, { conceptId, concept }) => {
    return ({
      form: 'concept_editor_' + conceptId,
      initialValues: {
        conceptId,
        concept: concept || {}
      },
    });
  }
)(_ConceptInfoEditor);

export default ConceptInfoEditor;