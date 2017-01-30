import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip
} from 'react-bootstrap';

import { UserInfoRef } from 'src/core/users';
import { 
  QuizzesRef, 
  QuizProblemsRef,
  QuizProgressRef,
  ProblemResponsesRef
} from 'src/core/quizzes/';

import {
  ProblemEditor,
  ProblemEditorItem,
} from 'src/views/components/quiz-editor';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import _ from 'lodash';

export class AddProblem extends Component {
  static propTypes = {
    busy: PropTypes.bool.isRequired,
    addProblem: PropTypes.func.isRequired
  }

  render() {
    const { busy, addProblem } = this.props;

    return (<div>
      <hr />
      <ProblemEditor busy={busy} onSubmit={addProblem}></ProblemEditor>
      <hr />
    </div>);
  }
}


@firebase((props, firebase) => ([
  QuizzesRef.path,
  QuizProblemsRef.path
]))
@connect(
  ({ firebase }) => ({
    quizzesRef: QuizzesRef(firebase),
    problemsRef: QuizProblemsRef(firebase)
  })
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
      busy: false,
      adding: false
    };
  }

  toggleAdding() { this.setState({ adding: !this.state.adding }); }

  wrapPromise(promise) {
    return promise
    .then(() => {
      this.setState({busy: false, error: null});
    })
    .catch((err) => {
      this.setState({busy: false, error: err});
    });
  }

  ProblemGrid(problems) {
    const { quizzesRef, problemsRef, params } = this.props;
    const { quizId } = params;

    // actions
    const updateProblem = (editorData) => {
      const { problemId, problem } = editorData;

      return this.wrapPromise(problemsRef.update_problem(quizId, problemId, problem));
    };
    const deleteProblemId = (problemId) => {
      return this.wrapPromise(problemsRef.deleteProblem(quizId, problemId));
    };
    const keyOrder = key => problems[key] && problems[key].num;

    // prepare props
    const problemProps = _.mapValues(problems, 
      (problem, problemId) => ({
        problemId,
        problem,
        updateProblem,
        deleteProblemId
      })
    );

    // return final element
    return (<SimpleGrid objects={problems} 
      keyOrder={keyOrder}
      rowProps={{
        className:'show-grid', 
        style: {
          display: 'flex',
          flexWrap: 'wrap'
      }}}
      colProps={{
        className: 'no-padding',
        style: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1px black solid'
      }}}
      nCols={3}
      objectComponentCreator={(key, value) => {
        return (
          <ProblemEditorItem key={key} busy={this.state.busy} {...problemProps[key]}/>
        );
      }}
    >
    </SimpleGrid>);
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
      const lastProblem = _.maxBy(Object.values(problems), 'num');
      problem.num = (lastProblem && lastProblem.num || 0)  + 1;
      return this.wrapPromise(problemsRef.add_problem(quizId, problem));
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

    const addButton = (<Button active={this.state.adding} bsStyle="success" bsSize="small" onClick={this.toggleAdding.bind(this)}>
      <FAIcon name="plus" className="color-green" /> add new problem
    </Button>);

    const problemsEl = !problems ? (
      // no problems
      <Alert bsStyle="info">quiz is empty</Alert>
    ) : (
      // display problems
      <div>{ this.ProblemGrid(problems) }</div>
    );

    //console.log(problems && _.map(problems, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{quiz.title} {addButton}</h3>
        { this.state.adding && <AddProblem busy={this.state.busy} quiz={quiz} addProblem={addProblem} /> }
        { errEl }
        { problemsEl }
      </div>
    );
  }
}
