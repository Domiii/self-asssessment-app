import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Jumbotron, Well, FormGroup } from 'react-bootstrap';
import { firebase, helpers } from 'redux-react-firebase';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import {
  LinkContainer
} from 'react-router-bootstrap';

import { UserInfo } from 'src/core/user-info';

import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { 
  Quizzes, 
  QuizProblems,
  QuizProgress,
  ProblemResponses
} from 'src/core/quizzes/';

import { FAIcon } from 'src/views/components/util';
const { isLoaded } = helpers;


export class QuizListItem extends Component {
  static propTypes = {
    quiz: PropTypes.object.isRequired,
    quizId: PropTypes.string.isRequired
  };

  render() {
    const { quiz, quizId } = this.props;

    return (
      <LinkContainer to={{ pathname: '/quiz/' + quizId }}>
        <Button>{quiz.title}</Button>
      </LinkContainer>
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
      <div>
        {_.map(quizzes, (quiz, id) => (<QuizListItem key={id} quizId={id} quiz={quiz} />))}
      </div>
    );
  }
}

// TODO: Use redux-form
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
          <Button type="submit" disabled={pristine || submitting}>Save</Button>
          <Button disabled={pristine || submitting} onClick={reset}>Clear</Button>
        </div>
      </form>
    );
  }
}

export const QuizEditor = reduxForm({ form: 'quiz_editor' /* unique form name */})(_QuizEditor);

export class QuizAddRegion extends Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    const { addQuiz } = this.props;

    return (
      //<SimpleForm 
      <QuizEditor onSubmit={addQuiz}></QuizEditor>
    );
  }
}


@firebase(({ params, auth }, firebase) => ([
  UserInfo.userPath(auth.uid),
  Quizzes.PATH_ROOT,
  QuizProblems.PATH_ROOT,
  ProblemResponses.PATH_ROOT,
  QuizProgress.PATH_ROOT
]))
@connect(
  ({ firebase }, { params, auth }) => {
    const getData = makeGetDataDefault(firebase);
    return {
      userInfo: new UserInfo(auth, getData),
      quizzes: new Quizzes(getData),
      problems: new QuizProblems(getData),
      responses: new ProblemResponses(getData),
      progress: new QuizProgress(getData)
    };
  }
)
export default class QuizzesPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    firebase: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,

    userInfo: PropTypes.instanceOf(UserInfo).isRequired,
    quizzes: PropTypes.instanceOf(Quizzes).isRequired,
    problems: PropTypes.instanceOf(QuizProblems).isRequired,
    responses: PropTypes.instanceOf(ProblemResponses).isRequired,
    progress: PropTypes.instanceOf(QuizProgress).isRequired
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
    const { router } = this.context;  
    const { userInfo, quizzes } = this.props;
    const isAdmin = userInfo.isCurrentAdmin();
    const isBusy = !isLoaded(quizzes.rootData);

    // prepare actions
    //const addQuiz = quizzes.addQuiz.bind(quizzes);
    const addQuiz = (q) => {
      quizzes.addQuiz(q);
    };


    // go render!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    const adminTools = isAdmin ? (<div>
      <hr />
      <QuizAddRegion addQuiz={addQuiz} />
    </div>) : undefined;

    return (<div>
      <QuizList quizzes={quizzes.rootData || {}} />
      {adminTools}
    </div>);
  }
}