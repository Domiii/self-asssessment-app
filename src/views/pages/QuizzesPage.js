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
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FAIcon } from 'src/views/components/util';

import QuizInfoEditor from 'src/views/components/quiz-editor/QuizInfoEditor';

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
    const quizViewPath = '/quiz-view/' + quizId;
    const quizPlayPath = '/quiz/' + quizId;

    return (
      <span>
        <Well className="no-margin">
          <div>
            <Link to={quizViewPath} onlyActiveOnIndex={true}>
              <h3 className="no-margin">{quiz.title}</h3>
            </Link>
          </div>
          <Link to={quizViewPath} onlyActiveOnIndex={true}>
            view
          </Link>
          <span className="margin-half" />
          <Link to={quizPlayPath} onlyActiveOnIndex={true}>
            play
          </Link>
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
        colProps={{className: 'padding-half'}}
        objectComponentCreator={(key, value) => <QuizListItem key={key} quizId={key} quiz={value} />}
      >
      </SimpleGrid>
    );
  }
}

class AddQuiz extends Component {
  static propTypes = {
    addQuiz: PropTypes.func.isRequired
  }

  render() {
    const { addQuiz } = this.props;

    return (
      <QuizInfoEditor onSubmit={addQuiz}></QuizInfoEditor>
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
    // prepare data + wrappers
    const { userInfo } = this.context;
    const { quizzesRef } = this.props;
    const mayEdit = userInfo && userInfo.adminDisplayMode();
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

    const adminTools = mayEdit && (<div>
      <AddQuiz addQuiz={addQuiz} />
      <hr />
    </div>);

    return (<div>
      {adminTools}
      <QuizList quizzes={quizzesRef.val || {}} />
    </div>);
  }
}