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

class _ProblemImporter extends Component {
  static propTypes = {
    
  };
}


_ProblemImporter = reduxForm({ enableReinitialize: true })(_ProblemImporter);

const ProblemImporter = connect(
  (state, { problemId, problem }) => {
    return ({
      form: 'problem_importer',
      initialValues: {
        problemId,
        problem: problem || {}
      },
    });
  }
)(_ProblemImporter);

export default ProblemImporter;