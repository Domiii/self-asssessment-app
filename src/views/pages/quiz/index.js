import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { Button, Jumbotron, Well } from 'react-bootstrap';
import { firebase, helpers } from 'redux-react-firebase'
import _ from 'lodash';

import { FAIcon } from 'src/views/components/util';
import { ScratchMarkdown } from 'src/views/components/scratch/ScratchMarkdown';

import { problems } from 'src/data';


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


@firebase([
  'todos'
])
@connect(
  ({firebase}) => ({
    todos: dataToJS(firebase, 'todos'),
  })
)
export class Quiz extends Component {
  static propTypes = {
    loadCategories: PropTypes.func.isRequired,
    loadProblems: PropTypes.func.isRequired,
    unloadProblems: PropTypes.func.isRequired,
    unloadCategories: PropTypes.func.isRequired,

    location: PropTypes.object.isRequired,
    userPrefs: PropTypes.object.isRequired,
    categories: PropTypes.instanceOf(List).isRequired,
    problems: PropTypes.instanceOf(List).isRequired
  };

  componentDidMount() {
    // init problems + categories (if not previously inited)
    this.props.loadCategories();
    this.props.loadProblems();
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    this.props.unloadProblems();
  }
  
  render() {
    // TODO: Actions!
    const getQuizById = ...;
    const getProblemById = ...;
    const gotoNextProblem = ...;
    const gotoPreviousProblem = ...;


    const quizId = this.props.params.quizId;
    const problemId = this.props.params.problemId;

    // TODO: State!
    const quiz = getQuizById(quizId);
    if (!quiz) {
      // TODO!
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      // TODO!
    }


    const QuizResponseMenuArgs = {};
    
    const navBtnStyle = {
      width: '50%'
    };
    
    const mainStyle = {
      minHeight: '400px'
    };

    const problemDOM = renderData(problem,
      () => (<FAIcon name="cog" spinning={true} />),
      () => (<Well>no problems added</Well>),
      () => (
          <div className="quiz-main" style={mainStyle}>
            <QuizProblem problem={problem} />
          </div>
          <QuizResponseMenu className="quiz-response-menu"
            {...QuizResponseMenuArgs}>
          </QuizResponseMenu>
        )
    );
    
    return (<div className="quiz-wrapper flex-row-multi">
        {problemDOM}
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