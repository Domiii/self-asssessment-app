import { UserInfo } from 'src/core/user-info';
import { makeGetDataDefault } from 'src/util/firebaseUtil';
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
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import _ from 'lodash';


class ProblemPreview extends Component {
  static propTypes = {
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired
  };

  render() {
    const { problemId, problem } = this.props;
    const description = problem.description_en || problem.description_zh;

    return (
      <Well className="no-padding">{description}</Well>
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
  QuizzesRef.PATH_ROOT,
  QuizProblemsRef.PATH_ROOT
]))
@connect(
  ({ firebase }) => {
    const getData = makeGetDataDefault(firebase);
    return {
      quizDb: QuizzesRef.getDefault(firebase),
      problemDb: new QuizProblemsRef(getData)
    };
  }
)
export default class QuizEditorPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfo: PropTypes.instanceOf(UserInfo).isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    quizDb: PropTypes.instanceOf(Quizzes).isRequired,
    problemDb: PropTypes.instanceOf(QuizProblems).isRequired
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
    const { quizDb, problemDb, params } = this.props;
    const isAdmin = userInfo && userInfo.isCurrentAdmin();
    const isBusy = !quizDb.isLoaded;
    const { quizId } = params;
    const quiz = quizDb.getQuiz(quizId);
    const problems = problemDb.getProblems(quizId);

    // prepare actions
    const addProblem = (editorData) => {
      // TODO: Use transaction to avoid race condition
      const { problem } = editorData;
      problem.num = _.size(problems)+1;
      return this.wrapPromise(problemDb.addProblem(quizId, problem));
    };
    const updateProblem = (editorData) => {
      const { problemId, problem } = editorData;
      return this.wrapPromise(problemDb.updateProblem(quizId, problemId, problem));
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
        <ProblemPreview key={problemId} 
          problemId={problemId} problem={problem}/>
      ))
    );


    console.log(problems && _.map(problems, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{quiz.title}</h3>
        { errEl }
        { problemList }
        <hr />
        <AddProblem busy={this.state.busy} quiz={quiz} addProblem={addProblem} />
      </div>
    );
  }
}
