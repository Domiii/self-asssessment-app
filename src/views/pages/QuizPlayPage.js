import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { firebase, helpers } from 'redux-react-firebase';
//import _ from 'lodash';

import { 
  QuizzesRef,
  QuizProblemsRef,
  QuizProgressRef,
  ProblemResponsesRef
} from 'src/core/quizzes/';

import { FAIcon } from 'src/views/components/util';
import Markdown from 'src/views/components/markdown';


const { isEmpty } = helpers;

const EmptyObject = {};

export class QuizProgressBar extends React.Component {
  static propTypes = {
    quiz: PropTypes.object.isRequired,
    problem: PropTypes.object,

    quizzesRef: PropTypes.object.isRequired,
    problemsRef: PropTypes.object.isRequired,
    responsesRef: PropTypes.object.isRequired,
    progressRef: PropTypes.object.isRequired
  };

  render() {
    const {
      quiz, problem, quizzesRef, problemsRef, responsesRef, progressRef,
      gotoPreviousProblem, gotoNextProblem
    } = this.props;
    const navBtnStyle = EmptyObject;
    const disabled = !problem;

    return (<div>
      <Well className="no-margin">
        <h3 className="no-margin inline">{quiz.title}</h3>

        <span className="margin-half" />

        <Button style={navBtnStyle}
          bsStyle="primary" bsSize="small" disabled={disabled}
          onClick={gotoPreviousProblem}>&lt;&lt;&lt;</Button>

        <span className="margin-half" />

        <Button  style={navBtnStyle}
          bsStyle="primary" bsSize="small" disabled={disabled}
          onClick={gotoNextProblem}>>>></Button>
      </Well>
    </div>);
  }
}


export class QuizProblem extends React.Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    problem: PropTypes.object
  };

  render () {
    // data
    if (!this.props.problem) {
      throw new Error('problem prop must be supplied before rendering');
    }
  
    const { lookupLocalized } = this.context;
    const { problem } = this.props;
    const title = lookupLocalized(problem, 'title');
    const description = lookupLocalized(problem, 'description');
    

    // go render!
    const QuizResponseMenuArgs = EmptyObject;
    const mainStyle = {
      minHeight: '400px'
    };
    const jumboStyle = {
      fontSize: '2em',
      
      height: '100%', 
      display: 'flex', 
      flex: '1 100%', 
      flexFlow: 'column',
      backgroundColor: 'white'
    };
    const titleStyle = {
      marginTop: 0
    };
    
    return (<div>
      <div className="quiz-main" style={mainStyle}>
        <Jumbotron className="no-margin"style={jumboStyle}>
            <div style={{flex: '8 auto'}}>
              <h2 style={titleStyle}>{title}</h2>
              <Markdown source={description} />
            </div>
            <div style={{flex: '1 auto', position: 'relative'}}>
              <textarea placeholder="小筆記" 
                disabled
                rows="2"
                style={{width: '100%', 
                  display:'block'}}></textarea>
            </div>
        </Jumbotron>
      </div>
      <QuizResponseMenu className="quiz-response-menu"
        {...QuizResponseMenuArgs}>
      </QuizResponseMenu>
    </div>);
  }
}

class QuizResponseMenu extends React.Component {
  render() {
    return (<div className="quiz-response-menu">
      <Button
          block bsSize="large" bsStyle="warning"
          //onClick={}
          >我看懂題目，但不知道怎麼找答案</Button>
      <Button
          block bsSize="large" bsStyle="info"
          //onClick={}
          >我知道答案，剛剛去查</Button>
      <Button
          block bsSize="large" bsStyle="success"
          //onClick={}
          >我早就知道答案，這次不需要查！</Button>
      <Button style={{visibility: 'hidden'}}
          block bsSize="large"
          >filler</Button>
      <Button
          block bsSize="large" bsStyle="default"
          //onClick={}
          >我看不懂題目</Button>
      <Button
          block bsStyle="danger" bsSize="large"
          //onClick={}
          >我覺得這題目有問題</Button>
    </div>);
  }
}


@firebase(({ params }, firebase) => ([
  QuizzesRef.path,
  QuizProblemsRef.path,
  ProblemResponsesRef.path,
  QuizProgressRef.path
]))
@connect(
  ({ firebase }) => {
    return {
      quizzesRef: QuizzesRef(firebase),
      problemsRef: QuizProblemsRef(firebase),
      responsesRef: ProblemResponsesRef(firebase),
      progressRef: QuizProgressRef(firebase)
    };
  }
)
export class QuizPlayPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    firebase: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,

    quizzesRef: PropTypes.object.isRequired,
    problemsRef: PropTypes.object.isRequired,
    responsesRef: PropTypes.object.isRequired,
    progressRef: PropTypes.object.isRequired
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
    // get basic data + wrappers
    const { router } = this.context;
    const { quizzesRef, problemsRef, responsesRef, progressRef, children } = this.props;
    let { quizId, problemId } = this.props.params;

    // prepare all actions
    const getQuizById = quizzesRef.quiz.bind(quizzesRef);
    const getProblemById = problemsRef.problem.bind(problemsRef);
    const getFirstProblemId = problemsRef.getFirstProblemId.bind(problemsRef);
    const getFirstProblem = problemsRef.getFirstProblem.bind(problemsRef);
    const gotoProblem = (newProblemId) => {
      if (newProblemId) {
        router.replace(`/quiz-play/${quizId}/problem/${newProblemId}`);
      }
    };
    const gotoFirstProblem = () => {
      const newProblemId = getFirstProblemId(quizId);
      setTimeout(() => gotoProblem(newProblemId), 1000);
    };

    const gotoNextProblem = () => {
      const newId = problemsRef.getNextProblemId(quizId, problemId);
      gotoProblem(newId);
    };
    const gotoPreviousProblem = () => {
      const newId = problemsRef.getPreviousProblemId(quizId, problemId);
      gotoProblem(newId);
    };
    const gotoRoot = router.replace.bind(router, '/');

    // get derived data
    const quizProblems = problemsRef.ofQuiz(quizId);
    const isBusy = !quizzesRef.isLoaded;
    const hasProblems = !isEmpty(quizProblems);
    problemId = problemId || getFirstProblemId(quizId);
    const problem = problemId && getProblemById(quizId, problemId);


    // go!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    const quiz = getQuizById(quizId);
    if (!quiz) {
      // invalid quiz id
      return (<Alert bsStyle="danger">invalid quizId <Button onClick={gotoRoot}>go back</Button></Alert>);
    }

    let contentEl;
    if (!problem) {
      // quiz has no problems at all
      contentEl = (<Alert bsStyle="info">quiz is empty</Alert>);
    }
    else {
      // render current problem
      contentEl = (<QuizProblem problem={problem} />);
    }

    return (
      <div className="quiz-wrapper flex-row-multi">
        <QuizProgressBar quiz={quiz} problem={problem} 
          quizzesRef={quizzesRef} problemsRef={problemsRef}
          progressRef={progressRef} responsesRef={responsesRef}
          gotoNextProblem={gotoNextProblem}
          gotoPreviousProblem={gotoPreviousProblem} />
        { contentEl }
      </div>
    );
  }
}