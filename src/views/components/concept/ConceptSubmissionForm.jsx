import autoBind from 'react-autobind';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Alert, Button, ButtonGroup, Jumbotron, Well,
  Grid, Row, Col, Panel
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';

import { 
  Field, reduxForm, FormSection, FieldArray
} from 'redux-form';
import { FAIcon } from 'src/views/components/util';
import _ from 'lodash';

const lang = {

};

class _ConceptSubmissionForm extends Component {
  static propTypes = {
    conceptId: PropTypes.string.isRequired,
    conceptSubmission: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  // changes values prior to submission
  //    see: https://github.com/erikras/redux-form/issues/1366
  doSubmit(isSubmitButton, submit) {
    const { 
      handleSubmit, onSubmit, change, reset
    } = this.props;

    change('conceptSubmission.hasSubmitted', submit);

    handleSubmit(values => {
      const trimmedText = values.conceptSubmission.text.trim();
      if (isSubmitButton && submit && !trimmedText.length) {
        return false;
      }
      const newValues = _.merge({}, values, {
        conceptSubmission: { 
          hasSubmitted: submit,
          text: trimmedText
        }
      });

      return onSubmit(newValues);
    })();
    // handleSubmit();
    reset();
  }

  PanelTitle(hasSubmitted) {
    return (<h3>提交區 <span className="margin"/> ({hasSubmitted ? '交了！' : '還沒交'})</h3>);
  }

  render() {
    const {
      conceptSubmission
    } = this.props;

    const { 
      reset, pristine, submitting
    } = this.props;

    const hasSubmitted = conceptSubmission && conceptSubmission.hasSubmitted || false;

    // render go!
    return (
      <Panel header={this.PanelTitle(hasSubmitted)} bsStyle={hasSubmitted && 'success' || 'danger'}>
        <form className="form-horizontal" onSubmit={() => {}}>
          <Field name="conceptId" component="input" type="hidden" />
          <FormSection name="conceptSubmission">
            <Field ref="hasSubmitted" name="hasSubmitted" component="input" type="hidden" />
            <Field name="text" component="textarea" rows="10" style={{width: '100%'}} />
          </FormSection>

          <div className="concept-response-buttons">
            <Button type="button" bsStyle="primary" disabled={pristine || submitting}
                onClick={this.doSubmit.bind(this, false, false)}
              >
              <span><FAIcon name="upload" /> Save (暫存)</span>
            </Button>

            <span className="margin" />

            <Button type="button" bsStyle="danger" bsSize="large"
              onClick={this.doSubmit.bind(this, true, !hasSubmitted)}
              active={hasSubmitted}
              disabled={false}>
              <span>
                <FAIcon name="upload"/> Submit (提交)
              </span>
              <span className="padding-half" />
              <span style={{fontSize: '1.5em'}}>
                { 
                hasSubmitted ?
                  <FAIcon name="check" className="color-lightgreen" /> : 
                  <FAIcon name="remove" className="color-lightred" />
                } 
              </span>
            </Button>

            <span className="margin" />

            <Button disabled={pristine || submitting} onClick={reset}>reset</Button>
          </div>
        </form>
      </Panel>
    );
  }
}

_ConceptSubmissionForm = reduxForm({ enableReinitialize: true })(_ConceptSubmissionForm);

const ConceptSubmissionForm = connect(
  (state, { conceptId, conceptSubmission }) => {
    return ({
      form: 'concept_response_' + conceptId,
      initialValues: {
        conceptId,
        conceptSubmission: conceptSubmission
      },
    });
  }
)(_ConceptSubmissionForm);

export default ConceptSubmissionForm;