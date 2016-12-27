import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { firebase, helpers } from 'redux-react-firebase'
//import _ from 'lodash';

import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { 
  Quizzes, 
  QuizProblems,
  QuizProgress,
  ProblemResponses
} from 'src/core/quizzes/';

import { FAIcon } from 'src/views/components/util';

@firebase(({ params }, firebase) => ([
  Quizzes.PATH_ROOT,
  QuizProblems.PATH_ROOT,
  ProblemResponses.PATH_ROOT,
  QuizProgress.PATH_ROOT
]))
@connect(
  ({ firebase }, { params }) => {
    const getData = makeGetDataDefault(firebase);
    return {
      uid: firebase._.authUid,
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

    uid: PropTypes.string.isRequired,
    quizzes: PropTypes.instanceOf(Quizzes).isRequired,
    problems: PropTypes.instanceOf(QuizProblems).isRequired,
    responses: PropTypes.instanceOf(ProblemResponses).isRequired,
    progress: PropTypes.instanceOf(QuizProgress).isRequired
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentShouldUpdate(nextProps) {
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

    return (<div>
      ni hao
    </div>);
  }
}