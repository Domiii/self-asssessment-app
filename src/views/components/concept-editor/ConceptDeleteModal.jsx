import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { ConceptPreview } from 'src/views/components/concept';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';


export default class ConceptDeleteModal extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    deleteConcept: PropTypes.func.isRequired
  };

  constructor(...args) { super(...args); this.state = { showModal: false }; }
  close() { this.setState({ showModal: false }); }
  open() { this.setState({ showModal: true }); }

  render() {

    // data
    const { lookupLocalized } = this.context;
    const { conceptId, concept, deleteConcept } = this.props;
    const title = lookupLocalized(concept, 'title');

    // actions
    const onClickDelete = () => {
      deleteConcept(conceptId);
      this.close();
    };

    // modal setup
    const open = this.open.bind(this);
    const close = this.close.bind(this);

    const modalContents = this.state.showModal && (
      <Modal show={this.state.showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Do you really want to delete the concept?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>{title}</h2>
          <ConceptPreview concept={concept} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ onClickDelete }
            bsStyle="danger">
            Yes
          </Button>
          <Button onClick={close}
            bsStyle="primary"
            bsSize="large">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    ) || undefined;

    return (
      <span>
        <Button onClick={open} className="color-red" bsSize="small">
          <FAIcon name="remove" />
        </Button>

        { modalContents }
      </span>
    );
  }
};
