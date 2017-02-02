import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { FAIcon } from 'src/views/components/util';

import ConceptPreview from './ConceptPreview';

import ConceptEditor from 'src/views/components/concept-editor/ConceptEditor';
import ConceptEditTools from 'src/views/components/concept-editor/ConceptEditTools';
console.assert(ConceptEditTools);

export class ConceptTags extends Component {
  static propTypes = {
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired
  };

  ConceptTag(tagText) {
    return (<span className="alert alert-danger no-padding no-margin">tagText</span>);
  }

  render() {
    const tags = this.concept && this.concept.tags || [];
    const tagEls = tags.map(tag => this.ConceptTag(tag));
    return tagEls && (<div>{tagEls}</div>) || null;
  }
}

export default class ConceptViewSmall extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    busy: PropTypes.bool.isRequired,
    mayEdit: PropTypes.bool.isRequired,
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    updateConcept: PropTypes.func.isRequired,
    deleteConceptId: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { editing: false };
    this.toggleEdit = (() => { this.setState({ editing: !this.state.editing }); }).bind(this);
  }

  render() {
    // data
    const { userInfo, lookupLocalized } = this.context;
    const { busy, conceptId, concept, updateConcept, deleteConceptId, mayEdit } = this.props;
    const conceptArgs = { conceptId, concept };
    const title = lookupLocalized(concept, 'title');

    // actions
    const onSubmit = (...args) => updateConcept(...args);
    //.then(() => this.stopEdit());

    // element: content
    const content = !mayEdit || !this.state.editing ?
      (<ConceptPreview {...conceptArgs} />) :
      (<ConceptEditor busy={busy} onSubmit={onSubmit} {...conceptArgs}></ConceptEditor>)
    ;

    // element: edit buttons
    const editTools = mayEdit && (
      <Row>
        <Col xs={12} className="inline-vcentered" style={{textAlign: 'left'}}>
          <ConceptEditTools {...{ 
            conceptId, concept, deleteConceptId,
            editing: this.state.editing,
            toggleEdit: this.toggleEdit }} />
        </Col>
      </Row>
    );

    // render
    return (
      <Grid fluid style={{width: '100%'}}>
        <Row style={{marginRight: '0.1em'}}>
          <Col xs={11} className="inline-vcentered" style={{textAlign: 'left'}}>
            <label>{title}</label>
          </Col>
          <Col xs={1} className="no-padding inline-vcentered" style={{textAlign: 'left'}}>
            <span className='color-gray'>#{concept.num}</span>
          </Col>
        </Row>
        { editTools }
        <Row>
          <Col xs={12}>
            { content }
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ConceptTags {...conceptArgs} />
          </Col>
        </Row>
      </Grid>
    );
  }
}