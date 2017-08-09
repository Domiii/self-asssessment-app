import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';
import autoBind from 'react-autobind';


export function DefaultButtonCreator({open, iconName, className}) {
  return (
    <Button onClick={open} 
      className={className}
      bsSize="small">

      <FAIcon name={iconName || 'trash'} />
    </Button>
  );
}


export default class ConfirmModal extends Component {
  static propTypes = {
    header: Proptypes.element,
    body: Proptypes.element,
    buttonCreator: Proptypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  constructor(...args) { 
    super(...args); 
    this.state = { showModal: false };

    autoBind(this);
  }

  open() { this.setState({ showModal: true }); }
  close() { this.setState({ showModal: false }); }

  onClickConfirm() {
    const {
      onConfirm
    } = this.props;

    onConfirm();
    this.close();
  }

  render() {
    // data
    const { 
      header,
      body,
      buttonCreator
    } = this.props;

    // actions
    const {
      open, close, onClickConfirm
    } = this;

    // modal setup
    const modalContents = this.state.showModal && (
      <Modal show={this.state.showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ onClickConfirm }
            bsStyle="danger">
            Yes
          </Button>
          <Button onClick={ close }
            bsStyle="primary"
            bsSize="large">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    ) || undefined;

    return (
      <span>
        { <buttonCreator open={open} /> }

        { modalContents }
      </span>
    );
  }
};