import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { firebase, helpers } from 'redux-react-firebase';
//import _ from 'lodash';

import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { 
  Quizzes, 
  QuizProblems,
  QuizProgress,
  ProblemResponses
} from 'src/core/quizzes/';

import { FAIcon } from 'src/views/components/util';
import ScratchMarkdown from 'src/views/components/scratch/ScratchMarkdown';


const { isLoaded, isEmpty } = helpers;


export class QuizProblem extends React.Component {
  render () {
    const problem = this.props.problem;
    const text = problem.q || problem.q_zh || "";
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
  Quizzes.PATH_ROOT,
  QuizProblems.PATH_ROOT,
  ProblemResponses.PATH_ROOT,
  QuizProgress.PATH_ROOT
]))
@connect(
  ({ firebase }, { params }) => {
    const getData = makeGetDataDefault(firebase);
    return {
      quizzes: new Quizzes(getData),
      problems: new QuizProblems(getData),
      responses: new ProblemResponses(getData),
      progress: new QuizProgress(getData)
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
    auth: PropTypes.object.isRequired,

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
    // get data + wrappers
    const { router } = this.context;
    const { auth, quizzes, problems, responses, progress, children } = this.props;
    const { quizId, problemId } = this.props.params;
    const { uid } = auth;

    const quizProblems = problems.getProblems(quizId);
    const isBusy = !isLoaded(quizzes.rootData);
    const hasProblems = !isEmpty(quizProblems);

    // prepare all actions
    const getQuizById = quizzes.getQuiz.bind(this);
    const getFirstProblemId = problems.getFirstProblemId.bind(this);
    const getProblemById = problems.getProblem.bind(problems, quizId);
    const gotoFirstProblem = () => {
      const newProblemId = getFirstProblemId(quizId);
      router.replace(`quiz/${quizId}/problem/${newProblemId}`);
    };

    const gotoNextProblem = undefined;
    const gotoPreviousProblem = undefined;
    const gotoRoot = router.replace.bind(router, '/');

    // go!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (!hasProblems) {
      // quiz has no problems at all
      return (<Alert bsStyle="info">quiz is empty</Alert>);
    }

    const quiz = getQuizById(quizId);
    if (!quiz) {
      // invalid quiz id -> TODO: redirect to overview page
      return (<Alert bsStyle="danger">invalid quizId <Button onClick={gotoRoot}>go back</Button></Alert>);
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      // invalid problem id -> redirect to first problem
      gotoFirstProblem();
      return (<Alert bsStyle="danger">invalid problemId</Alert>);
    }
    else {
      const navBtnStyle = {
        width: '50%'
      };

      return (
        <div className="quiz-wrapper flex-row-multi">
          { children }
          <footer className="footer" style={{position: 'relative'}}>
            <div className="some-margin2" />
            <div>
              <Button style={navBtnStyle}
                bsStyle="primary" bsSize="large"
                onClick={gotoPreviousProblem}>&lt;&lt;&lt;</Button>
              <Button  style={navBtnStyle}
                bsStyle="primary" bsSize="large"
                onClick={gotoNextProblem}>>>></Button>
            </div>
          </footer>
        </div>
      );
    }
  }
}