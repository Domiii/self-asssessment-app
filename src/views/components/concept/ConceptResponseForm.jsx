import autoBind from 'react-autobind';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';

import { 
  Field, reduxForm, FormSection, FieldArray
} from 'redux-form';
import { FormInputField, FormInputFieldArray, FAIcon } from 'src/views/components/util';
import _ from 'lodash';


class _ConceptResponseForm extends Component {
  static propTypes = {
    conceptId: PropTypes.string.isRequired,
    conceptResponse: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  // changes values prior to submission
  //    see: https://github.com/erikras/redux-form/issues/1366
  doSubmit(submit) {
    const { 
      handleSubmit, onSubmit, change, reset
    } = this.props;

    change('conceptResponse.hasSubmitted', submit);

    handleSubmit(values => {
      const newValues = _.merge({}, values, { conceptResponse: { hasSubmitted: submit } });
      return onSubmit(newValues);
    })();
    // handleSubmit();
    reset();
  }

  render() {
    const {
      conceptResponse
    } = this.props;

    const { 
      reset, pristine, submitting
    } = this.props;

    const hasSubmitted = conceptResponse && conceptResponse.hasSubmitted || false;

    // render go!
    return (
      <form className="form-horizontal" onSubmit={() => {}}>
        <Field name="conceptId" component="input" type="hidden" />
        <FormSection name="conceptResponse">
          <Field ref="hasSubmitted" name="hasSubmitted" component="input" type="hidden" />
          <FormInputField name="text" label="Your results (你的結果～)"
            component="textarea"
            inputProps={{rows: '10'}}
            labelProps={{xs: 2, className: 'no-padding'}}
            inputColProps={{xs: 10, className: 'no-padding'}}
          />
        </FormSection>

        <div>
          <Button type="button" bsStyle="primary" disabled={pristine || submitting}
            onClick={this.doSubmit.bind(this, false)}
          >
            <span><FAIcon name="upload" /> Save (暫存)</span>
          </Button>
          <Button type="button" bsStyle="danger" disabled={pristine || submitting}
            onClick={this.doSubmit.bind(this, !hasSubmitted)}
            active={hasSubmitted}>
            <span><FAIcon name="upload" /> Submit (提交)</span>
          </Button>
          <span className="margin" />
          <Button disabled={pristine || submitting} onClick={reset}>reset</Button>
        </div>
      </form>
    );
  }
}

_ConceptResponseForm = reduxForm({ enableReinitialize: true })(_ConceptResponseForm);

const ConceptResponseForm = connect(
  (state, { conceptId, conceptResponse }) => {
    return ({
      form: 'concept_response_' + conceptId,
      initialValues: {
        conceptId,
        conceptResponse: conceptResponse
      },
    });
  }
)(_ConceptResponseForm);

export default ConceptResponseForm;