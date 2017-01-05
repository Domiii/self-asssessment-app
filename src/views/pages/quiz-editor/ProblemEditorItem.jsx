import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { FAIcon } from 'src/views/components/util';


import ProblemDeleteModal from './ProblemDeleteModal';
import ProblemEditor from './ProblemEditor';

import ProblemPreview from 'src/views/components/quiz/ProblemPreview';

export default class ProblemEditorItem extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired
  };

  static propTypes = {
    busy: PropTypes.bool.isRequired,
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired,
    updateProblem: PropTypes.func.isRequired,
    deleteProblemId: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { editing: false };
  }
  startEdit() { this.setState({ editing: true }); }
  stopEdit() { this.setState({ editing: false }); }
  toggleEdit() { this.setState({ editing: !this.state.editing }); }

  get EditButton() {
    return (<Button onClick={() => this.toggleEdit()} className="color-green" bsSize="small" active={this.state.editing}>
      <FAIcon name="edit" />
    </Button>);
  }

  render() {
    // data
    const { userInfo } = this.context;
    const { busy, problemId, problem, updateProblem, deleteProblemId } = this.props;
    const isAdmin = userInfo && userInfo.isAdmin();
    const problemArgs = { problemId, problem };

    // actions
    const onSubmit = (...args) => updateProblem(...args);
    //.then(() => this.stopEdit());

    // element: content
    const content = !this.state.editing ?
      (<ProblemPreview {...problemArgs} />) :
      (<ProblemEditor busy={busy} onSubmit={onSubmit} {...problemArgs}></ProblemEditor>)
    ;

    // element: number
    const numEl = <span className='color-gray' style={{float: 'right'}}>#{problem.num}</span>;

    // element: edit buttons
    const buttons = (<span>
      { this.EditButton }
      <ProblemDeleteModal {...{ problemId, problem, deleteProblemId }} />
      { numEl }
    </span>);

    // render
    return (
      <Grid fluid style={{width: '100%'}}>
        <Row>
          <Col xs={12} className="inline-vcentered" style={{textAlign: 'left'}}>
            { buttons }
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            { content }
          </Col>
        </Row>
      </Grid>
    );
  }
}