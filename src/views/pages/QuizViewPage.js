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
  ProblemGrid
} from 'src/views/components/quiz';

import {
  QuizInfoEditor,
  ProblemEditor,
  AddProblemEditor
} from 'src/views/components/quiz-editor';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import _ from 'lodash';

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
export default class QuizViewPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
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

  toggleAdding() {
    this.setState({ 
      adding: !this.state.adding,
      editingQuiz: false
    });
  }

  toggleEditing() {
    this.setState({ 
      editingQuiz: !this.state.editingQuiz,
      adding: false
    });
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
    const { userInfo, router, lookupLocalized } = this.context;  
    const { quizzesRef, problemsRef, params } = this.props;
    const mayEdit = userInfo && userInfo.adminDisplayMode() || false;
    const notLoadedYet = !quizzesRef.isLoaded;
    const busy = this.state.busy;
    const { quizId } = params;
    const quiz = quizzesRef.quiz(quizId);
    const problems = problemsRef.ofQuiz(quizId);

    // prepare actions
    const gotoRoot = router.replace.bind(router, '/');
    const addProblem = ({ problem }) => {
      // TODO: Use transaction to avoid race condition
      const lastProblem = problems && _.maxBy(Object.values(problems), 'num') || null;
      problem.num = (lastProblem && lastProblem.num || 0)  + 1;
      return this.wrapPromise(problemsRef.add_problem(quizId, problem));
    };
    const updateQuiz = ({quizId, quiz}) => {
      return this.wrapPromise(quizzesRef.update_quiz(quizId, quiz));
    };
    const updateProblem = ({ problemId, problem }) => {
      return this.wrapPromise(problemsRef.update_problem(quizId, problemId, problem));
    };
    const deleteProblemId = (problemId) => {
      return this.wrapPromise(problemsRef.deleteProblem(quizId, problemId));
    };

    // go render!
    if (notLoadedYet) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (!quiz) {
      //setTimeout(() => router.replace('/'), 3000);
      return (<Alert bsStyle="danger">invalid quizId <Button onClick={gotoRoot}>go back</Button></Alert>);
    }

    const quizTitle = lookupLocalized(quiz, 'title');

    // elements
    let tools, topEditors;
    if (mayEdit) {
      tools = (<span>
        <Button active={this.state.editingQuiz} 
          bsStyle="success" bsSize="small" onClick={this.toggleEditing.bind(this)}>
          <FAIcon name="pencil" className="" />
        </Button>
        <Button active={this.state.adding} 
          bsStyle="success" bsSize="small" onClick={this.toggleAdding.bind(this)}>
          <FAIcon name="plus" className="color-green" /> add new problem
        </Button>
      </span>);
      if (this.state.adding) {
        topEditors = (
          <AddProblemEditor busy={busy} quiz={quiz} addProblem={addProblem}>
          </AddProblemEditor>
        );
      }
      if (this.state.editingQuiz) {
        topEditors = (
          <QuizInfoEditor quizId={quizId} quiz={quiz} onSubmit={updateQuiz}></QuizInfoEditor>
        );
      }
    }

    const problemsEl = !problems ? (
      // no problems
      <Alert bsStyle="info">quiz is empty</Alert>
    ) : (
      // display problems
      <div><ProblemGrid {...{
        busy, quizId, problems, mayEdit, updateProblem, deleteProblemId
      }} /></div>
    );

    //console.log(problems && _.map(problems, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{quizTitle} {tools}</h3>
        { topEditors }
        { errEl }
        { problemsEl }
      </div>
    );
  }
}
