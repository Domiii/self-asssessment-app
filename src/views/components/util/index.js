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

export class SimpleGrid extends Component {
  static propTypes = {
    objects: PropTypes.object.isRequired,   // an object containing a bunch of objects to display
    nCols: PropTypes.number.isRequired,
    objectComponentCreator: PropTypes.func.isRequired,
    objectPropName: PropTypes.string.isRequired,
    rowProps: PropTypes.object,
    keyCompareFunction: PropTypes.func     // optional function for sorting objects before rendering
  };

  render() {
    const { nCols, objects, objectComponentCreator, objectPropName, rowProps, keyCompareFunction } = this.props;
    const keys = Object.keys(objects);
    const nChildren = keys.length;
    console.assert(nCols > 0, 'nCols passed to SimpleGrid is invalid: ' + nCols);
    const colSize = 12/nCols;
    console.assert(colSize === Math.round(colSize), 'nCols must be divisible by 12 (because of Bootstrap\'s grid system): ' + nCols);
    console.assert(!isNaN(nChildren), 'objects passed to SimpleGrid are invalid: ' + objects);
    const nRows = Math.ceil(nChildren / nCols);
    console.assert(nRows >= 0);

    // sort objects
    if (!!keyCompareFunction) {
      keys.sort(keyCompareFunction);
    }

    // create rows
    const rows = [];
    let iItem = 0;
    for (let iRow = 0; iRow < nRows; ++iRow) {
      const props = rowProps || {};
      const columns = [];
      for (let iCol = 0; iCol < nCols && iItem < nChildren; ++iCol) {
        const key = keys[iItem++];
        const value = objects[key];
        //console.assert(key && value, `invalid object: #${iItem} ${key}=${value}`);
        const el = objectComponentCreator(key, value);
        const col = (<Col key={iCol} xs={colSize}>{el}</Col>);
        columns.push(col);
      }
      const row = (<Row key={iRow} {...props}>{columns}</Row>);
      rows.push(row);
    }

    // render the whole thing
    return (
      <Grid>
        {rows}
      </Grid>
    );
  }
}


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