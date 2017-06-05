import _ from 'lodash';

import autoBind from 'react-autobind';
import React, { Component, PropTypes } from 'react';
import { 
  ButtonGroup, Button
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
    changeOrder: PropTypes.func,

    editing: PropTypes.bool,
    toggleEdit: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  changeOrderUp() {
    const { conceptId, changeOrder } = this.props;

    changeOrder(conceptId, -1);
  }

  changeOrderDown() {
    const { conceptId, changeOrder } = this.props;

    changeOrder(conceptId, 1);
  }

  get EditButton() {
    const { editing, toggleEdit } = this.props;
    return (<Button onClick={toggleEdit} 
      className="" bsSize="small" active={editing}>
      <FAIcon name="edit" />
    </Button>);
  }

  get ChangeOrderButtons() {
    const { changeOrder } = this.props;
    if (!changeOrder) return null;

    return (<ButtonGroup>
      <Button onClick={this.changeOrderUp}
        className="" bsSize="small" >
        <FAIcon name="caret-square-o-left" />
      </Button>
      <Button onClick={this.changeOrderDown}
        className="" bsSize="small" >
        <FAIcon name="caret-square-o-right" />
      </Button>
    </ButtonGroup>);
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
      { this.ChangeOrderButtons }
      { this.TogglePublicButton }
      { this.EditButton }
      { this.DeleteButton }
    </span>);
  }
}

