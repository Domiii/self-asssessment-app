import { UserInfo } from 'src/core/user-info';
import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { 
  Quizzes, 
  QuizProblems,
  QuizProgress,
  ProblemResponses
} from 'src/core/quizzes/';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Alert, Button, Jumbotron, Well, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FAIcon } from 'src/views/components/util';

import _ from 'lodash';


const { isLoaded } = helpers;


export class QuizListItem extends Component {
  static contextTypes = {
    userInfo: PropTypes.instanceOf(UserInfo).isRequired
  };

  static propTypes = {
    quiz: PropTypes.object.isRequired,
    quizId: PropTypes.string.isRequired
  };

  render() {
    const { userInfo } = this.context;
    const { quiz, quizId } = this.props;
    const quizPath = '/quiz/' + quizId;
    const isAdmin = userInfo && userInfo.isCurrentAdmin();

    const adminTools = !isAdmin ? undefined : (
      <span>
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
              play&nbsp;
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
        objectPropName="quiz"
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
          <Button disabled={pristine || submitting} onClick={reset}>Clear</Button>
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
  Quizzes.PATH_ROOT,
  QuizProblems.PATH_ROOT,
  ProblemResponses.PATH_ROOT,
  QuizProgress.PATH_ROOT
]))
@connect(
  ({ firebase }) => {
    const getData = makeGetDataDefault(firebase);
    return {
      quizzes: new Quizzes(getData),
      problems: new QuizProblems(getData),
      responses: new ProblemResponses(getData),
      progress: new QuizProgress(getData)
    };
  }
)
export default class QuizzesPage extends Component {
  static contextTypes = {
    userInfo: PropTypes.instanceOf(UserInfo).isRequired
  };

  static propTypes = {
    firebase: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,

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
    const { userInfo } = this.context;
    const { quizzes } = this.props;
    const isAdmin = userInfo && userInfo.isCurrentAdmin();
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

    const adminTools = !isAdmin ? undefined : (<div>
      <hr />
      <AddQuiz addQuiz={addQuiz} />
    </div>);

    return (<div>
      <QuizList quizzes={quizzes.rootData || {}} />
      {adminTools}
    </div>);
  }
}