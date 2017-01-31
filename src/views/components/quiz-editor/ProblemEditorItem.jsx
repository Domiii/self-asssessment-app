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



export class ProblemTags extends Component {
  static propTypes = {
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired
  };

  ProblemTag(tagText) {
    return (<span className="alert alert-danger no-padding no-margin">tagText</span>);
  }

  render() {
    const tags = this.problem && this.problem.tags || [];
    const tagEls = tags.map(tag => this.ProblemTag(tag));
    return tagEls && (<div>{tagEls}</div>) || null;
  }
}

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
    const title = problem.title_en || problem.title_zh;

    // actions
    const onSubmit = (...args) => updateProblem(...args);
    //.then(() => this.stopEdit());

    // element: content
    const content = !this.state.editing ?
      (<ProblemPreview {...problemArgs} />) :
      (<ProblemEditor busy={busy} onSubmit={onSubmit} {...problemArgs}></ProblemEditor>)
    ;

    // element: edit buttons
    const buttons = (<span>
      { this.EditButton }
      <ProblemDeleteModal {...{ problemId, problem, deleteProblemId }} />
    </span>);

    // render
    return (
      <Grid fluid style={{width: '100%'}}>
        <Row style={{marginRight: '0.1em'}}>
          <Col xs={11} className="inline-vcentered" style={{textAlign: 'left'}}>
            <label>{title}</label>
          </Col>
          <Col xs={1} className="no-padding inline-vcentered" style={{textAlign: 'left'}}>
            <span className='color-gray'>#{problem.num}</span>
          </Col>
        </Row>
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
        <Row>
          <Col xs={12}>
            <ProblemTags {...problemArgs} />
          </Col>
        </Row>
      </Grid>
    );
  }
}