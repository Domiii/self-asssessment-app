import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col
} from 'react-bootstrap';

import { FAIcon } from 'src/views/components/util';

import ConceptDeleteModal from './ConceptDeleteModal';

export default class ConceptEditTools extends Component {
  static propTypes = {
    ownerId: PropTypes.string,
    parentId: PropTypes.string,
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,

    toggleConceptPublic: PropTypes.func.isRequired,
    deleteConcept: PropTypes.func.isRequired,

    editing: PropTypes.bool,
    toggleEdit: PropTypes.func.isRequired
  };

  get EditButton() {
    const { editing, toggleEdit } = this.props;
    return (<Button onClick={() => toggleEdit()} 
      className="" bsSize="small" active={editing}>
      <FAIcon name="edit" />
    </Button>);
  }

  get DeleteButton() {
    const { conceptId, concept, deleteConcept } = this.props;
    const modalProps = {
      conceptId,
      concept,
      deleteConcept
    };

    return (
      <ConceptDeleteModal {...modalProps}  />
    );
  }

  get TogglePublicButton() {
    const { conceptId, concept, toggleConceptPublic } = this.props;
    const icon = concept.isPublic ? 'unlock' : 'lock';
    const className = concept.isPublic ? 'color-green' : 'color-red';
    return (<Button onClick={() => toggleConceptPublic(conceptId)}
      className={className} bsSize="small" active={false}>
      <FAIcon name={icon} />
    </Button>);
  }

  render() {
    return (<span style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
      { this.TogglePublicButton }
      { this.EditButton }
      { this.DeleteButton }
    </span>);
  }
}

