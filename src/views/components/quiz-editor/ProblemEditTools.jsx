import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { FAIcon } from 'src/views/components/util';

import ProblemDeleteModal from './ProblemDeleteModal';
console.assert(ProblemDeleteModal);

export default class ProblemEditTools extends Component {
  static propTypes = {
    editing: PropTypes.bool,
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired,
    deleteProblemId: PropTypes.func.isRequired,
    toggleEdit: PropTypes.func.isRequired
  };

  get EditButton() {
    return (<Button onClick={() => this.props.toggleEdit()} 
      className="color-green" bsSize="small" active={this.props.editing}>
      <FAIcon name="edit" />
    </Button>);
  }

  render() {
    const { problemId, problem, deleteProblemId } = this.props;
    return (<span>
      { this.EditButton }
      <ProblemDeleteModal {...{ problemId, problem, deleteProblemId }} />
    </span>);
  }
}

