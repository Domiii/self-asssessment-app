import {
  ConceptResponsesRef
}
from 'src/core/concepts';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { 
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { LoadOverlay } from 'src/views/components/overlays';
import { SubmissionList } from 'src/views/components/submissions';

import { firebaseConnect } from 'react-redux-firebase'

import _ from 'lodash';
import autoBind from 'react-autobind';


@firebaseConnect((props, firebase) => {
  return [
    ConceptResponsesRef.makeQuery()
  ];
})
@connect(({ firebase }, props) => {
  return {
    conceptResponsesRef: ConceptResponsesRef(firebase)
  };
})
class SubmissionPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    conceptResponsesRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  get isNotLoadedYet() {
    const { conceptResponsesRef } = this.props;
    return !conceptResponsesRef.isLoaded;
  }

  get currentSubmissions() {
    const { conceptResponsesRef } = this.props;
    return conceptResponsesRef.val;
  }

  render() {
    if (this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (!this.currentSubmissions) {
      return (
        <Alert bsStyle="warning">
          <span>there are no submissions</span>
        </Alert>
      );
    }

    return (
      <SubmissionList  
        submissions={this.currentSubmissions} />
    );
  }
}

export default SubmissionPage;