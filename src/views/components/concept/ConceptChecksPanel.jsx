import React, { Component, PropTypes } from 'react';
import { 
  Alert, ListGroup
} from 'react-bootstrap';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { ConceptCheckItem } from '.';


export default class ConceptChecksPanel extends Component {
  static propTypes = {
    conceptChecks: PropTypes.object,
    conceptCheckResponses: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  render() {
    const { 
      conceptChecks, conceptCheckResponses, updateCheckResponse
    } = this.props;

    if (!conceptChecks) {
      return (
        <Alert bsStyle="info">concept has no checks</Alert>
      );
    }

    const checkEls = _.map(conceptChecks, (check, checkId) => (
      <ConceptCheckItem 
      key={checkId} checkId={checkId} check={check} 
      selectedResponse={conceptCheckResponses && conceptCheckResponses[checkId]}
      updateCheckResponse={updateCheckResponse} />
    ));

    return (
      <ListGroup>
        { checkEls }
      </ListGroup>
    );
  }
}