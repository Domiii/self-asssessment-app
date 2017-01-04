import { UserInfoRef } from 'src/core/users';
import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { 
  QuizzesRef,
  QuizProblemsRef,
  QuizProgressRef,
  ProblemResponsesRef
} from 'src/core/quizzes/';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase } from 'redux-react-firebase';
import { Alert, Button, Jumbotron, Well, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FAIcon } from 'src/views/components/util';

import _ from 'lodash';


export class QuizListItem extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired
  };

  static propTypes = {
    quiz: PropTypes.object.isRequired,
    quizId: PropTypes.string.isRequired
  };

  render() {
    const { userInfo } = this.context;
    const { quiz, quizId } = this.props;
    const quizPath = '/quiz/' + quizId;
    const isAdmin = userInfo && userInfo.isAdmin();

    const adminTools = !isAdmin ? undefined : (
      <span>
        &nbsp;
        <Link to={'/quiz-editor/' + quizId} onlyActiveOnIndex={true}>
          <span>edit</span>
        </Link>
      </span>
    );

    return (
      <span>
        <Well className="no-margin">
          <div>
            <Link to={quizPath} onlyActiveOnIndex={true}>
              <h3 className="no-margin">{quiz.title}</h3>
            </Link>
          </div>
          <span>
            <Link to={quizPath} onlyActiveOnIndex={true}>
              play
            </Link>
          </span>
          {adminTools}
        </Well>
      </span>
    );
  }
}

export class QuizList extends Component {
  static propTypes = {
    quizzes: PropTypes.object.isRequired
  };

  render() {
    const { quizzes } = this.props;

    return (
      <SimpleGrid objects={quizzes} 
        nCols={4}
        objectComponentCreator={(key, value) => <QuizListItem key={key} quizId={key} quiz={value} />}
      >
      </SimpleGrid>
    );
  }
}

//  see: http://redux-form.com/6.4.1/examples/simple/
class _QuizEditor extends Component {
  static propTypes = {
    quiz: PropTypes.object
  };

  constructor(...args) {
    super(...args);
  }

  render() {
    const { quiz } = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const title = quiz && quiz.title;

    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

        //<FormGroup role="form">
    return (
      <form onSubmit={onSubmit}>
        <div>
          <Field name="title" component="input" type="text" placeholder="quiz title" />
        </div>

        <div>
          <Button type="submit" disabled={pristine || submitting}>
            {(!quiz ?
              (<span><FAIcon name="plus" className="color-green" /> add new problem</span>):
              (<span><FAIcon name="upload" className="color-green" /> save</span>)
            )}
          </Button>
          <Button disabled={pristine || submitting} onClick={reset}>reset</Button>
        </div>
      </form>
    );
  }
}

export const QuizEditor = reduxForm({ form: 'quiz_editor' /* unique form name */})(_QuizEditor);

export class AddQuiz extends Component {
  static propTypes = {
    addQuiz: PropTypes.func.isRequired
  }

  render() {
    const { addQuiz } = this.props;

    return (
      <QuizEditor onSubmit={addQuiz}></QuizEditor>
    );
  }
}


@firebase((props, firebase) => ([
  QuizzesRef.path,
  QuizProblemsRef.path,
  ProblemResponsesRef.path,
  QuizProgressRef.path
]))
@connect(
  ({ firebase }) => {
    return {
      quizzesRef: QuizzesRef(firebase),
      problemsRef: QuizProblemsRef(firebase)
    };
  }
)
export default class QuizzesPage extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired
  };

  static propTypes = {
    quizzesRef: PropTypes.object.isRequired,
    problemsRef: PropTypes.object.isRequired
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentWillUnmount() {
  }
  
  render() {
    // TODO: Display list of all quizzes
    // TODO: Add + edit quiz (if isAdmin)
    // TODO: Delete quiz if empty (if isAdmin)
    // TODO: Add question (if isAdmin)
    // TODO: Edit question (if isAdmin)
    // TODO: Delete question (if isAdmin)
    // TODO: Import questions (if isAdmin)

    // prepare data + wrappers
    const { userInfo } = this.context;
    const { quizzesRef } = this.props;
    const isAdmin = userInfo && userInfo.isAdmin();
    const isBusy = !quizzesRef.isLoaded;

    // prepare actions
    //const addQuiz = quizzesRef.add_quiz.bind(quizzesRef);
    const addQuiz = (q) => {
      quizzesRef.add_quiz(q);
    };


    // go render!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    const adminTools = !isAdmin ? undefined : (<div>
      <hr />
      <AddQuiz addQuiz={addQuiz} />
    </div>);

    return (<div>
      <QuizList quizzes={quizzesRef.val || {}} />
      {adminTools}
    </div>);
  }
}