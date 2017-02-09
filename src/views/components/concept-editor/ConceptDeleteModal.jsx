import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

export default class ConceptDeleteModal extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    parentId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    deleteConcept: PropTypes.func.isRequired
  };

  constructor(...args) { super(...args); this.state = { showModal: false }; }
  close() { this.setState({ showModal: false }); }
  open() { this.setState({ showModal: true }); }

  render() {

    // data
    const { lookupLocalized } = this.context;
    const { parentId, concept, deleteConcept } = this.props;
    const description = lookupLocalized(concept, 'description');

    // actions
    const onClickDelete = () => {
      deleteConcept(parentId);
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
          {description}
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
