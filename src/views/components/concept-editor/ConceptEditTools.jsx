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
    conceptActions: PropTypes.object.isRequired,
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
    const { conceptId, concept, conceptActions } = this.props;
    const modalProps = {
      conceptId,
      concept,
      deleteConcept: conceptActions.deleteConcept
    };

    return (
      <ConceptDeleteModal {...modalProps}  />
    );
  }

  get TogglePublicButton() {
    const { conceptId, concept, conceptActions } = this.props;
    const { toggleConceptPublic } = conceptActions;
    const icon = concept.isPublic ? 'unlock' : 'lock';
    const className = concept.isPublic ? 'color-green' : 'color-red';
    return (<Button onClick={() => toggleConceptPublic(conceptId)}
      className={className} bsSize="small" active={false}>
      <FAIcon name={icon} />
    </Button>);
  }

  render() {
    //const { parentId, concept, conceptActions } = this.props;

    return (<span>
      { this.TogglePublicButton }
      { this.EditButton }
      { this.DeleteButton }
    </span>);
  }
}

