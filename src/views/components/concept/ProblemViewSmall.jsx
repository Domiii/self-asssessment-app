import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';

import { FAIcon } from 'src/views/components/util';

import ProblemPreview from './ProblemPreview';

import ProblemEditor from 'src/views/components/concept-editor/ProblemEditor';
import ProblemEditTools from 'src/views/components/concept-editor/ProblemEditTools';
console.assert(ProblemEditTools);

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

export default class ProblemViewSmall extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    busy: PropTypes.bool.isRequired,
    mayEdit: PropTypes.bool.isRequired,
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired,
    updateProblem: PropTypes.func.isRequired,
    deleteProblemId: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { editing: false };
    this.toggleEdit = (() => { this.setState({ editing: !this.state.editing }); }).bind(this);
  }

  render() {
    // data
    const { userInfo, lookupLocalized } = this.context;
    const { busy, problemId, problem, updateProblem, deleteProblemId, mayEdit } = this.props;
    const problemArgs = { problemId, problem };
    const title = lookupLocalized(problem, 'title');

    // actions
    const onSubmit = (...args) => updateProblem(...args);
    //.then(() => this.stopEdit());

    // element: content
    const content = !mayEdit || !this.state.editing ?
      (<ProblemPreview {...problemArgs} />) :
      (<ProblemEditor busy={busy} onSubmit={onSubmit} {...problemArgs}></ProblemEditor>)
    ;

    // element: edit buttons
    const editTools = mayEdit && (
      <Row>
        <Col xs={12} className="inline-vcentered" style={{textAlign: 'left'}}>
          <ProblemEditTools {...{ 
            problemId, problem, deleteProblemId,
            editing: this.state.editing,
            toggleEdit: this.toggleEdit }} />
        </Col>
      </Row>
    );

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
        { editTools }
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