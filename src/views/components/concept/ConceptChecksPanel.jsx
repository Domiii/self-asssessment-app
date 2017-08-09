import React, { Component, PropTypes } from 'react';
import { 
  Well, Alert, ListGroup
} from 'react-bootstrap';

import { EmptyObject } from 'src/util';

import { ConceptCheckItem } from '.';

const EmptyArray = Object.freeze([]);

export default class ConceptChecksPanel extends Component {
  static propTypes = {
    conceptId: PropTypes.string,
    conceptChecks: PropTypes.object,
    conceptCheckResponses: PropTypes.array.isRequired,
    conceptCheckResponseDetails: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  render() {
    const { 
      conceptId,
      conceptChecks, 
      conceptCheckResponses,
      conceptCheckResponseDetails,
      updateCheckResponse
    } = this.props;

    if (!conceptChecks) {
      return (
        <span />
      );
    }

    const checkArr = _.sortBy(_.map(conceptChecks,
      (check, checkId) => ({check, checkId, num: parseFloat(check.num)})
    ),  'num');

    const checkEls = _.map(checkArr, ({checkId, check}) => (<ConceptCheckItem
        key={checkId} {...{
          conceptId, checkId, 
          check,
          selectedResponse: conceptCheckResponses && _.find(conceptCheckResponses, {checkId}),
          responseDetails: conceptCheckResponseDetails,
          updateCheckResponse
        }} 
      />
    ));

    const deletedCheckResponseIds = _.filter(_.map(conceptCheckResponses, 'checkId'), 
      checkId => !conceptChecks[checkId]);

    const deletedCheckResponsesEls = _.map(deletedCheckResponseIds, (checkId) => (
      <ConceptCheckItem {...{
        key: checkId,
        conceptId, checkId, 
        check: null,
        selectedResponse: conceptCheckResponses && _.find(conceptCheckResponses, {checkId}),
        responseDetails: conceptCheckResponseDetails,
        updateCheckResponse
      }} />
    ));

    return (
      <ListGroup>
        { checkEls }
        { deletedCheckResponsesEls }
      </ListGroup>
    );
  }
}