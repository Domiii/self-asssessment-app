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
    editing: PropTypes.bool,
    ownerId: PropTypes.string,
    parentId: PropTypes.string,
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    deleteConcept: PropTypes.func.isRequired,
    toggleEdit: PropTypes.func.isRequired
  };

  get EditButton() {
    return (<Button onClick={() => this.props.toggleEdit()} 
      className="color-green" bsSize="small" active={this.props.editing}>
      <FAIcon name="edit" />
    </Button>);
  }

  render() {
    //const { parentId, concept, deleteConcept } = this.props;

    return (<span>
      { this.EditButton }
      <ConceptDeleteModal {...this.props} />
    </span>);
  }
}

