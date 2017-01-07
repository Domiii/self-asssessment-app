import React, { Component, PropTypes } from 'react';
import { 
  Grid, Row, Col,
  Form, FormGroup, FormControl, ControlLabel, FieldArray
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

// <FieldArray name="members" component={members =>


export class FormInputFieldBase extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    labelProps: PropTypes.object,
    inputColProps: PropTypes.object,
    inputProps: PropTypes.object
  };

  constructor(...args) {
    super(...args);
  }

  createField(component) {
    let { 
      name, label, placeholder, labelProps, inputColProps, inputProps
    } = this.props;

    return (<FormGroup controlId={name}>
      <Col componentClass={ControlLabel} {...(labelProps || {})} >
        {label}
      </Col>
      <Col {...(inputColProps || {})}>
        { component }
      </Col>
    </FormGroup>);
  }
}

// see: http://redux-form.com/6.4.3/examples/fieldArrays/
export class FormInputFieldArray extends FormInputFieldBase {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    labelProps: PropTypes.object,
    inputColProps: PropTypes.object,
    inputProps: PropTypes.object,
    component: PropTypes.any
  };

  render() {
    let { 
      name, inputProps, component
    } = this.props;

    return this.createField(<FieldArray className="form-control" 
      key={name} id={name} name={name}
      component={component}
      {...(inputProps || {})}>
      {this.props.children}
    </FieldArray>);
  }
}


export class FormInputField extends FormInputFieldBase {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    labelProps: PropTypes.object,
    inputColProps: PropTypes.object,
    inputProps: PropTypes.object,
    component: PropTypes.any
  };

  render() {
    let { 
      name, label, placeholder, inputProps
    } = this.props;
    placeholder = placeholder || label;

    return this.createField(<Field className="form-control" 
      key={name} id={name} name={name} 
      component={component}
      placeholder={placeholder}
      {...(inputProps || {})}>
      {this.props.children}
    </Field>);
  }
}
