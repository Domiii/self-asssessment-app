import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { Link } from 'react-router'
import { hrefConceptView } from 'src/views/href';

import { FAIcon } from 'src/views/components/util';
import { getProgressColor } from 'src/views/components/ProgressBar';

import ConceptPreview from './ConceptPreview';
import ConceptEditTools from 'src/views/components/concept-editor/ConceptEditTools';

export class ConceptTags extends Component {
  static propTypes = {
    ownerId: PropTypes.string,
    parentId: PropTypes.string,
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
    userInfoRef: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    busy: PropTypes.bool.isRequired,
    mayEdit: PropTypes.bool.isRequired,
    ownerId: PropTypes.string,
    parentId: PropTypes.string,
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    conceptProgress: PropTypes.object.isRequired,
    
    toggleConceptPublic: PropTypes.func.isRequired,
    deleteConcept: PropTypes.func.isRequired,
    updateConcept: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.toggleEdit = (() => {
      const { router } = this.context;
      const { ownerId, conceptId } = this.props;
      router.replace(hrefConceptView(ownerId, conceptId, 'edit'));
    }).bind(this);
  }

  render() {
    // data
    const { userInfoRef, lookupLocalized } = this.context;
    const { busy, parentId, conceptId, 
      concept, conceptProgress,
      toggleConceptPublic, deleteConcept, updateConcept, 
      mayEdit } = this.props;
    
    const ownerId = concept.ownerId;
    const conceptArgs = { ownerId, parentId, conceptId, concept };
    const title = lookupLocalized(concept, 'title');

    const progressPct = Math.round((conceptProgress && 
      conceptProgress[conceptId] && 
      conceptProgress[conceptId].progress 
      || NaN) * 100);
    const progressColor = getProgressColor(progressPct);

    // element: title line
    const titleEl = (
      <Row style={{marginRight: '0.1em'}}>
        <Col xs={11} className="inline-vcentered" style={{textAlign: 'left'}}>
          <Link to={ hrefConceptView(concept.ownerId, conceptId) }>
            <h3 style={{display: 'inline'}} className="no-padding no-margin">{title}</h3>
            {/**<Button bsSize="small">*/}
            &nbsp;&nbsp;<FAIcon name="sign-in"/>
            {/**</Button>*/}
          </Link>
        </Col>
        <Col xs={1} className="no-padding inline-vcentered" style={{textAlign: 'left'}}>
          <span className='color-gray'>#{concept.num}</span>
        </Col>
      </Row>
    );

    // element: content
    const contentPreviewEl = (<ConceptPreview {...conceptArgs} />);

    const contentEl = (
      <Row style={{
        paddingTop: '0.4em'}}>

        <Col xs={12} style={{
          maxHeight: '300px',
          overflow: 'hidden'}}>
          { contentPreviewEl }
        </Col>
      </Row>
    );

    // element: edit buttons
    const editToolsEl = mayEdit && (
      <Row>
        <Col xs={8} />
        <Col xs={4} className="inline-vcentered" style={{textAlign: 'left'}}>
          <ConceptEditTools
            {...conceptArgs}
            {...{ 
              toggleConceptPublic,
              deleteConcept,
              editing: false,
              toggleEdit: this.toggleEdit }} />
        </Col>
      </Row>
    );

    // const tagsEl = (<Row>
    //   <Col xs={12}>
    //     <ConceptTags {...conceptArgs} />
    //   </Col>
    // </Row>);

    // render
    return (
      <Grid fluid style={{width: '100%',
        border: `3px ${progressColor} solid`}}>
        { titleEl }
        { editToolsEl }
        { contentEl }
        { /* tagsEl */  }
      </Grid>
    );
  }
}