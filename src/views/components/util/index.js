import React, { Component, PropTypes } from 'react';
import { 
  Grid, Row, Col,
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';
import { Field } from 'redux-form';

// Online demo: https://codepen.io/Domiii/pen/mOaGWG?editors=0010
export class FAIcon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    spinning: PropTypes.bool,
    childProps: PropTypes.object
  };

  render() {
    let classes = "fa fa-" + this.props.name + (!!this.props.className && (' ' + this.props.className) || '');
    if (this.props.spinning) {
      classes += ' fa-spin';
    }
    return (
    <i className={classes} aria-hidden="true" {...this.props.childProps}>
      {this.props.children}
    </i>);
  }
}

export SimpleGrid from './SimpleGrid';


export class FormInputField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    labelProps: PropTypes.object,
    inputColProps: PropTypes.object,
    inputProps: PropTypes.object
  };

  render() {
    let { name, label, placeholder, labelProps, inputColProps, inputProps } = this.props;
    placeholder = placeholder || label;

    return (
      <FormGroup controlId={name}>
        <Col componentClass={ControlLabel} {...(labelProps || {})} >
          {label}
        </Col>
        <Col {...(inputColProps || {})}>
          <Field className="form-control" id={name} name={name} {...(inputProps || {})}
            placeholder={placeholder}>
            {this.props.children}
          </Field>
        </Col>
      </FormGroup>
    );
  }
}