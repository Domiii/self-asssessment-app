import React, { Component, PropTypes } from 'react';
import { 
  Alert, ListGroup
} from 'react-bootstrap';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { ConceptCheckItem } from '.';


export default class ConceptChecks extends Component {
  static propTypes = {
    conceptChecks: PropTypes.any
  };

  render() {
    const { conceptChecks } = this.props;

    if (!conceptChecks) {
      return (
        <Alert bsStyle="info">concept has no checks</Alert>
      );
    }

    const checkEls = _.map(conceptChecks, (check, index) => (
      <ConceptCheckItem key={index} check={check} />
    ));

    return (
      <ListGroup>
        { checkEls }
      </ListGroup>
    );
  }
}