import React, { Component, PropTypes } from 'react';
import { 
  Alert, ListGroup
} from 'react-bootstrap';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { ConceptCheckItem } from '.';

import { asArray } from 'src/util/miscUtil';


export default class ConceptChecks extends Component {
  static propTypes = {
    conceptChecks: PropTypes.any
  };

  render() {
    const { conceptChecks } = this.props;
    const checksArr = asArray(conceptChecks);

    if (!conceptChecks) {
      return (
        <Alert bsStyle="info">concept has no checks</Alert>
      );
    }

    const checkEls = checksArr.map((check, index) => (
      <ConceptCheckItem key={index} check={check} />
    ));

    return (
      <ListGroup>
        { checkEls }
      </ListGroup>
    );
  }
}