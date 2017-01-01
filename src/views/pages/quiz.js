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
import ScratchMarkdown from 'src/views/components/scratch/ScratchMarkdown';


const { isEmpty } = helpers;

export class QuizProgressBar extends React.Component {
  static propTypes = {
    quiz: PropTypes.object.isRequired,
    problem: PropTypes.object,

    quizzes: PropTypes.object.isRequired,
    problemsRef: PropTypes.object.isRequired,
    responses: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired
  };

  render() {
    const { quiz, problem, quizzes, problems, responses, progress } = this.props;

    return (<div>
      <Well className="no-margin">
        <h3 className="no-margin inline">{quiz.title}</h3>

      </Well>
      <div className="margin2" />
    </div>);
  }
}


export class QuizProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object
  };

  render () {
    // data
    if (!this.props.problem) {
      throw new Error('problem prop must be supplied before rendering');
    }

    const { problem } = this.props;
    const text = problem.description_en || problem.description_zh || "";
    

    // go render!
    const QuizResponseMenuArgs = {};
    const mainStyle = {
      minHeight: '400px'
    };
    const jumboStyle = {
      fontSize: '2em',
      
      height: '100%', 
      display: 'flex', 
      flex: '1 100%', 
      flexFlow: 'column'
    };
    
    return (<div>
      <div className="quiz-main" style={mainStyle}>
        <Jumbotron className="no-margin"style={jumboStyle}>
            <div style={{flex: '8 auto'}}>
              <ScratchMarkdown text={text} />
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
        <div>
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
        </div>
    </div>);
  }
}


@firebase(({ params }, firebase) => ([
  QuizzesRef.PATH_ROOT,
  QuizProblemsRef.PATH_ROOT,
  ProblemResponsesRef.PATH_ROOT,
  QuizProgressRef.PATH_ROOT
]))
@connect(
  ({ firebase }, { params }) => {
    return {
      quizzes: QuizzesRef(firebase),
      problems: QuizProblemsRef(firebase),
      responses: ProblemResponsesRef(firebase),
      progress: QuizProgressRef(firebase)
    };
  }
)
export class QuizPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    firebase: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,

    quizzes: PropTypes.object.isRequired,
    problems: PropTypes.object.isRequired,
    responses: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired
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
    // get data + wrappers
    const { router } = this.context;
    const { quizzes, problems, responses, progress, children } = this.props;
    const { quizId, problemId } = this.props.params;

    const quizProblems = problems.getProblems(quizId);
    const isBusy = !quizzes.isLoaded;
    const hasProblems = !isEmpty(quizProblems);

    // prepare all actions
    const getQuizById = quizzes.quiz.bind(quizzes);
    const getProblemById = problems.ofQuiz.bind(problems);
    const getFirstProblemId = problems.getFirstProblemId.bind(problems);
    const getFirstProblem = problems.getFirstProblem.bind(problems);
    const gotoFirstProblem = () => {
      const newProblemId = getFirstProblemId(quizId);
      setTimeout(() => router.replace(`/quiz/${quizId}/problem/${newProblemId}`), 1000);
    };

    const gotoNextProblem = undefined;
    const gotoPreviousProblem = undefined;
    const gotoRoot = router.replace.bind(router, '/');


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
    const problem = getProblemById(quizId, problemId) || getFirstProblem(quizId);

    if (!problem) {
      // quiz has no problems at all
      contentEl = (<Alert bsStyle="info">quiz is empty</Alert>);
    }
    else {
      const navBtnStyle = {
        width: '50%'
      };
      contentEl = (<div>
        <QuizProblem problem={problem} />
        <footer className="footer" style={{position: 'relative'}}>
          <div className="margin" />
          <div>
            <Button style={navBtnStyle}
              bsStyle="primary" bsSize="large"
              onClick={gotoPreviousProblem}>&lt;&lt;&lt;</Button>
            <Button  style={navBtnStyle}
              bsStyle="primary" bsSize="large"
              onClick={gotoNextProblem}>>>></Button>
          </div>
        </footer>
      </div>);
    }

    return (
      <div className="quiz-wrapper flex-row-multi">
        <QuizProgressBar quiz={quiz} problem={problem} 
          quizzes={quizzes} problems={problems}
          progress={progress} responses={responses} />
        { contentEl }
      </div>
    );
  }
}