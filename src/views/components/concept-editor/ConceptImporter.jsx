import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal,
  FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { FormInputField, FAIcon } from 'src/views/components/util';

import _ from 'lodash';

class _ConceptImporter extends Component {
  static propTypes = {
    
  };
}


_ConceptImporter = reduxForm({ enableReinitialize: true })(_ConceptImporter);

const ConceptImporter = connect(
  (state, { conceptId, concept }) => {
    return ({
      form: 'concept_importer',
      initialValues: {
        conceptId,
        concept: concept || {}
      },
    });
  }
)(_ConceptImporter);

export default ConceptImporter;