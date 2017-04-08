import React, { Component, PropTypes } from 'react';
import {
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { FAIcon } from 'src/views/components/util';

import {
  ConceptDescriptionFull,
  ConceptChecksPanel
} from 'src/views/components/concept';

import ProgressBar from 'src/views/components/ProgressBar';

export class ConceptPlayView extends Component {
  static propTypes = {
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    userPrefs: PropTypes.object.isRequired,
    conceptChecks: PropTypes.object,
    conceptCheckResponses: PropTypes.object,
    conceptProgress: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  get ProgressBar() {
    const { conceptId, conceptProgress } = this.props;
    const progressPct = Math.round((conceptProgress && 
      conceptProgress[conceptId] && 
      conceptProgress[conceptId].progress 
      || 0) * 100);

    return (<ProgressBar progressPct={progressPct} />);
  }

  render() {
    const {
      conceptId, concept, conceptChecks, userPrefs, 
      conceptCheckResponses,
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
            <ConceptChecksPanel conceptId={conceptId} conceptChecks={conceptChecks}
              conceptCheckResponses={conceptCheckResponses}
              updateCheckResponse={updateCheckResponse} />
          </Item>
        </Flex>
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