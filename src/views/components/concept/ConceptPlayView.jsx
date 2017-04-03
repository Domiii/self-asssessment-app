import React, { Component, PropTypes } from 'react';
import {
  Alert, Button, Jumbotron,
  Grid, Row, Col
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { FAIcon } from 'src/views/components/util';

import {
  ConceptDescriptionFull,
  ConceptChecksPanel
} from 'src/views/components/concept';

export class ConceptPlayView extends Component {
  static propTypes = {
    concept: PropTypes.object.isRequired,
    conceptChecks: PropTypes.object,
    conceptCheckResponses: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  render() {
    const {
      concept, conceptChecks, userPrefs, conceptCheckResponses, updateCheckResponse
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
        <Flex {...flexProps} alignItems="start">
          <Item {...itemProps}>
            <ConceptDescriptionFull concept={concept} />
          </Item>
          <Item {...itemProps}>
            <ConceptChecksPanel conceptChecks={conceptChecks}
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