import React, { Component, PropTypes } from 'react';
import { 
  Well, Alert, ListGroup
} from 'react-bootstrap';

import { EmptyObject } from 'src/util';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { ConceptCheckItem } from '.';

const EmptyArray = Object.freeze([]);

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
        <Well />
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

    const deletedCheckResponses = _.filter(
      _.keys(conceptCheckResponses || EmptyObject), 
      checkId => !conceptChecks[checkId]);

    const deletedCheckResponsesEls = _.map(deletedCheckResponses, (checkId) => (
      <ConceptCheckItem
        key={checkId} conceptId={conceptId} {...{checkId, check: null}} 
        selectedResponse={conceptCheckResponses && conceptCheckResponses[checkId]}
        updateCheckResponse={updateCheckResponse} />
    ));

    return (
      <ListGroup>
        { checkEls }
        { deletedCheckResponsesEls }
      </ListGroup>
    );
  }
}