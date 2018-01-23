import map from 'lodash/map';
import filter from 'lodash/filter';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';



import React, { Component, PropTypes } from 'react';
import { 
  Well, Alert
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

    const checkArr = sortBy(map(conceptChecks,
      (check, checkId) => ({check, checkId, num: parseFloat(check.num)})
    ), 'num');

    const checkEls = map(checkArr, ({checkId, check}) => (<ConceptCheckItem
        key={checkId} {...{
          conceptId, checkId, 
          check,
          selectedResponse: conceptCheckResponses && find(conceptCheckResponses, {checkId}),
          responseDetails: conceptCheckResponseDetails,
          updateCheckResponse
        }} 
      />
    ));

    const deletedCheckResponseIds = filter(map(conceptCheckResponses, 'checkId'), 
      checkId => !conceptChecks[checkId]);

    const deletedCheckResponsesEls = map(deletedCheckResponseIds, (checkId) => (
      <ConceptCheckItem {...{
        key: checkId,
        conceptId, checkId, 
        check: null,
        selectedResponse: conceptCheckResponses && find(conceptCheckResponses, {checkId}),
        responseDetails: conceptCheckResponseDetails,
        updateCheckResponse
      }} />
    ));

    return (
      <div>
        { checkEls }
        { deletedCheckResponsesEls }
      </div>
    );
  }
}