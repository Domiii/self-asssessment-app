import React, { Component, PropTypes } from 'react';
import {
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { FAIcon } from 'src/views/components/util';

import {
  ConceptDescriptionFull,
  ConceptChecksPanel,
  ConceptResponseForm
} from 'src/views/components/concept';

import ProgressBar from 'src/views/components/ProgressBar';


export class ConceptPlayView extends Component {
  static propTypes = {
    userPrefs: PropTypes.object.isRequired,
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    conceptResponse: PropTypes.object,
    conceptChecks: PropTypes.object,
    conceptCheckResponses: PropTypes.array.isRequired,
    conceptCheckResponseDetails: PropTypes.object,
    conceptProgress: PropTypes.object,

    updateConceptResponse: PropTypes.func,
    updateCheckResponse: PropTypes.func.isRequired
  };

  get ProgressBar() {
    const { conceptId, conceptProgress } = this.props;

    const progressPct = (conceptProgress && 
      conceptProgress[conceptId] && 
      !isNaN(conceptProgress[conceptId].progress)) ?
      Math.round(conceptProgress[conceptId].progress * 100) :
      NaN;

    return (<ProgressBar progressPct={progressPct} />);
  }

  render() {
    const {
      userPrefs,
      conceptId, concept, 
      conceptResponse,
      conceptChecks,
      conceptCheckResponses,
      conceptCheckResponseDetails,

      updateConceptResponse,
      updateCheckResponse
    } = this.props;
    const { conceptPlayViewWideScreen } = userPrefs;

    const flexProps = {
      [!conceptPlayViewWideScreen && 'row' || 'column']: true
    };
    const itemProps = {
      className: conceptPlayViewWideScreen && "max-width" || ''
    };

    return (
      <div>
        { this.ProgressBar }
        <Flex {...flexProps} alignItems="start">
          <Item {...itemProps}>
            <ConceptDescriptionFull concept={concept} />
          </Item>
          <Item {...itemProps}>
            <ConceptChecksPanel {...{
              conceptId,
              conceptChecks,
              conceptCheckResponses,
              conceptCheckResponseDetails,
              updateCheckResponse
            }} />
          </Item>
        </Flex>
        {
          (!!conceptResponse || concept.expectsSubmission) && 
            (<div>
              <ConceptResponseForm {...{
                conceptId,
                conceptResponse,
                onSubmit: updateConceptResponse
              }} />
            </div>)
        }
      </div>
    );
  }
}


export class ConceptPlayViewControls extends Component {
  static propTypes = {
    updateUserPrefs: PropTypes.func.isRequired
  };

  render() {
    const { userPrefs, updateUserPrefs } = this.props;
    const { conceptPlayViewWideScreen } = userPrefs;

    return (<div className="concept-play-view-controls">
      <Button bsStyle="primary" 
        active={conceptPlayViewWideScreen}
        onClick={() => 
          updateUserPrefs({conceptPlayViewWideScreen: !conceptPlayViewWideScreen})
        }>
        <FAIcon name="arrows-h" />
      </Button>
    </div>);
  }
}