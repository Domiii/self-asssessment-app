import React, { Component, PropTypes } from 'react';
import { 
  Alert, ListGroup
} from 'react-bootstrap';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { ConceptCheckItem } from '.';


export default class ConceptChecksPanel extends Component {
  static propTypes = {
    conceptId: PropTypes.string,
    conceptChecks: PropTypes.object,
    conceptCheckResponses: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  render() {
    const { 
      conceptId, conceptChecks, conceptCheckResponses, updateCheckResponse
    } = this.props;

    if (!conceptChecks) {
      return (
        <Alert bsStyle="info">concept has no checks</Alert>
      );
    }

    const checkArr = _.sortBy(_.map(conceptChecks,
      (check, checkId) => ({check, checkId, num: check.num})
    ),  'num');

    const checkEls = _.map(checkArr, ({checkId, check}) => (
      <ConceptCheckItem
        key={checkId} conceptId={conceptId} {...{checkId, check}} 
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