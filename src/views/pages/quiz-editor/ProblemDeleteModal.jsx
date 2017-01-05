import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

export default class ProblemDeleteModal extends Component {
  static propTypes = {
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired,
    deleteProblemId: PropTypes.func.isRequired
  };

  constructor(...args) { super(...args); this.state = { showModal: false }; }
  close() { this.setState({ showModal: false }); }
  open() { this.setState({ showModal: true }); }

  render() {

    // data
    const { problemId, problem, deleteProblemId } = this.props;
    const description = problem.description_en || problem.description_zh;

    // actions
    const deleteProblem = () => {
      deleteProblemId(problemId);
      this.close();
    };

    // modal setup
    const open = this.open.bind(this);
    const close = this.close.bind(this);

    return (
      <span>
        <Button onClick={open} className="color-red" bsSize="small">
          <FAIcon name="remove" />
        </Button>

        <Modal show={this.state.showModal} onHide={close}>
          <Modal.Header closeButton>
            <Modal.Title>Do you really want to delete the problem?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {description}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ deleteProblem }
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
      </span>
    );
  }
};
