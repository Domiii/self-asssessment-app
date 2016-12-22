import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { firebase, helpers } from 'redux-react-firebase'
import _ from 'lodash';

import { ProblemResponses } from 'src/core/quizzes';

import { FAIcon } from 'src/views/components/util';
import { ScratchMarkdown } from 'src/views/components/scratch/ScratchMarkdown';


const { dataToJS } = helpers;


class QuizProblem extends React.Component {
  render () {
    const problem = this.props.problem;
    const text = problem.q || problem.q_zh || "";
    const contStyle = {
      fontSize: '2em',
      
      height: '100%', 
      display: 'flex', 
      flex: '1 100%', 
      flexFlow: 'column'
    };
    const childStyle = {
      flex: '1 auto'
    };



    const QuizResponseMenuArgs = {};
    
    const navBtnStyle = {
      width: '50%'
    };
    const mainStyle = {
      minHeight: '400px'
    };
    <div className="quiz-main" style={mainStyle}>
            <QuizProblem problem={problem} />
          </div>
          <QuizResponseMenu className="quiz-response-menu"
            {...QuizResponseMenuArgs}>
          </QuizResponseMenu>
    
    return (<Jumbotron className="no-margin"style={contStyle}>
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
    </Jumbotron>);
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

// TODO: Finalize component structure with correct data dependencies?
//    data counts + statistics in Quiz component?
// TODO: Create new wrappers in mapStateToProps?

// NOTE: Re-mapping (and thus re-rendering) everything for single questions is not a good idea
//    -> see: https://github.com/JAndritsch/redux/blob/optimization-recipe/docs/recipes/Optimization.md

@firebase(({ params }, firebase) => ([
  getPath.problems(params.quizId),
  ProblemResponses.getDefaultPath(firebase._.authUid, params.quizId),
  getPath.progress(firebase._.authUid, params.quizId)
]))
@connect(
  ({ firebase }, { params }) => ({
    uid: firebase._.authUid,
    problem: dataToJS(firebase, QuizProblems.getProblemPath(params.quizId, params.problemId)),
    response: dataToJS(firebase, ProblemResponses.ROOT_PATH),
    progress: dataToJS(firebase, getPath.progress(firebase._.authUid, params.quizId))
  })
)
export class Quiz extends Component {
  static propTypes = {
    firebase: PropTypes.object.isRequired,

    uid: PropTypes.number.isRequired,
    problems: PropTypes.instanceOf(List).isRequired,
    responses: PropTypes.instanceOf(List).isRequired,
    progress: PropTypes.instanceOf(List).isRequired
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
    // TODO: selectors + actions!
    const isBusy = ...;
    const hasProblems = ...;
    const getQuizById = ...;
    const getProblems = ...;
    const getProblemById = ...;
    const gotoNextProblem = ...;
    const gotoPreviousProblem = ...;

    if (isBusy()) {
      return (<FAIcon name="cog" spinning={true} />);
    }
    if (!hasProblems()) {
      // quiz has no problems at all
      return (<Alert bsStyle="info">quiz is empty</Alert>);
    }

    const quizId = this.props.params.quizId;
    const problemId = this.props.params.problemId;

    const quiz = getQuizById(quizId);
    if (!quiz) {
      // invalid quiz id -> TODO: redirect to overview page
      return (<Alert bsStyle="danger">invalid quizId</Alert>);
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      // invalid problem id -> TODO: redirect to first problem
      return (<Alert bsStyle="danger">invalid problemId</Alert>);
    }
    else {
      return (
        <div className="quiz-wrapper flex-row-multi">
          <QuizProblem problem={problem} />
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