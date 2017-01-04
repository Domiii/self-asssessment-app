import { UserInfoRef } from 'src/core/users';
import { 
  QuizzesRef, 
  QuizProblemsRef,
  QuizProgressRef,
  ProblemResponsesRef
} from 'src/core/quizzes/';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal
} from 'react-bootstrap';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import _ from 'lodash';

export class ProblemDeleteModal extends Component {
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

export class ProblemRow extends Component {
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
  startEdit() { this.setState({ editing: false }); }
  stopEdit() { this.setState({ editing: true }); }
  toggleEdit() { this.setState({ editing: !this.state.editing }); }

  get EditButton() {
    return (<Button onClick={() => this.toggleEdit()} className="color-green" bsSize="small">
      <FAIcon name="edit" />
    </Button>);
  }

  render() {
    // data
    const { userInfo } = this.context;
    const { busy, problemId, problem, updateProblem, deleteProblemId } = this.props;
    const description = problem.description_en || problem.description_zh;
    const isAdmin = userInfo && userInfo.isAdmin();
    const content = !this.state.editing ?
      (<Well className="no-padding no-margin" style={{fontSize: '2em'}}>
        {description}
      </Well>) :

      (<ProblemEditor busy={busy} onSubmit={updateProblem} {...{ problemId, problem }}></ProblemEditor>)
    ;

    // elements
    const adminTools = !isAdmin ? undefined : (<span>
      { this.EditButton }
      <ProblemDeleteModal {...{ problemId, problem, deleteProblemId }} />
    </span>);

    // render
    return (
      <Row>
        <Col xs={11}>
          { content }
        </Col>
        <Col xs={1} className="inline-vcentered">
          { adminTools }
        </Col>
      </Row>
    );
  }
}

//  see: http://redux-form.com/6.4.1/examples/simple/
class _ProblemEditor extends Component {
  static propTypes = {
    //quiz: PropTypes.object.isRequired,
    busy: PropTypes.bool,
    problemId: PropTypes.string,
    problem: PropTypes.object
  };

  render() {
    const { busy, problemId, problem } = this.props;
    const { handleSubmit, pristine, reset, submitting, values } = this.props;
    const num = problem && problem.num || 0;

    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <Field name="problemId" value={problemId} component="input" type="hidden" />
        <Field name="problem.num" value={num} component="input" type="hidden" />
        <FormInputField name="problem.description_en" label="Description (English)"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="problem.description_zh" label="Description (中文)"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />

        <div>
          <Button type="submit" disabled={pristine || submitting || busy}>
            {(!problem ?
              (<span><FAIcon name="plus" className="color-green" /> add new problem</span>):
              (<span><FAIcon name="upload" className="color-green" /> save</span>)
            )}
          </Button>
          <Button disabled={pristine || submitting || busy} onClick={reset}>reset</Button>
        </div>
      </form>
    );
  }
}

_ProblemEditor = reduxForm({ enableReinitialize: true })(_ProblemEditor);
export const ProblemEditor = connect(
  (state, { problemId, problem }) => {
    return ({
      form: 'problem_editor_' + problemId,
      initialValues: {
        problemId,
        problem
      }
    });
  }
)(_ProblemEditor);

export class AddProblem extends Component {
  static propTypes = {
    busy: PropTypes.bool.isRequired,
    addProblem: PropTypes.func.isRequired
  }

  render() {
    const { busy, addProblem } = this.props;

    return (
      <ProblemEditor busy={busy} onSubmit={addProblem}></ProblemEditor>
    );
  }
}


@firebase((props, firebase) => ([
  QuizzesRef.path,
  QuizProblemsRef.path
]))
@connect(
  ({ firebase }) => {
    return {
      quizzesRef: QuizzesRef(firebase),
      problemsRef: QuizProblemsRef(firebase)
    };
  }
)
export default class QuizEditorPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    quizzesRef: PropTypes.object.isRequired,
    problemsRef: PropTypes.object.isRequired
  }

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false
    };
  }

  wrapPromise(promise) {
    return promise
    .then(() => {
      this.setState({busy: false, error: null});
    })
    .catch((err) => {
      this.setState({busy: false, error: err});
    });
  }

  render() {
    // prepare data
    const { userInfo, router } = this.context;  
    const { quizzesRef, problemsRef, params } = this.props;
    const isAdmin = userInfo && userInfo.isAdmin();
    const isBusy = !quizzesRef.isLoaded;
    const { quizId } = params;
    const quiz = quizzesRef.quiz(quizId);
    const problems = problemsRef.ofQuiz(quizId);

    // prepare actions
    const addProblem = (editorData) => {
      // TODO: Use transaction to avoid race condition
      const { problem } = editorData;
      problem.num = _.size(problems)+1;
      return this.wrapPromise(problemsRef.add_problem(quizId, problem));
    };
    const updateProblem = (editorData) => {
      const { problemId, problem } = editorData;
      debugger;
      return this.wrapPromise(problemsRef.update_problem(quizId, problemId, problem));
    };
    const deleteProblemId = (problemId) => {
      return this.wrapPromise(problemsRef.delete_problem(quizId, problemId));
    };

    // go render!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (!isAdmin) {
      setTimeout(() => router.replace('/'), 3000);
      return (<Alert bsStyle="danger">invalid permissions</Alert>);
    }

    if (!quiz) {
      //setTimeout(() => router.replace('/'), 3000);
      return (<Alert bsStyle="danger">invalid quizId: {quizId}</Alert>);
    }

    const problemList = !problems ? (
      // no problems
      <Alert bsStyle="info">quiz is empty</Alert>
    ) : (
      // list problem editors
      _.map(problems, (problem, problemId) => (
        <ProblemRow key={problemId} 
          busy={this.state.busy}
          {...{
            problemId, 
            problem,
            updateProblem,
            deleteProblemId
          }}/>
      ))
    );

    //console.log(problems && _.map(problems, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{quiz.title}</h3>
        { errEl }
        <Grid>
          { problemList }
        </Grid>
        <hr />
        <AddProblem busy={this.state.busy} quiz={quiz} addProblem={addProblem} />
      </div>
    );
  }
}
