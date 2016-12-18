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


export class Quiz extends Component {
  static propTypes = {
    loadCategories: PropTypes.func.isRequired,
    loadQuestions: PropTypes.func.isRequired,
    unloadQuestions: PropTypes.func.isRequired,
    unloadCategories: PropTypes.func.isRequired,

    location: PropTypes.object.isRequired,
    userPrefs: PropTypes.object.isRequired,
    categories: PropTypes.instanceOf(List).isRequired,
    questions: PropTypes.instanceOf(List).isRequired
  };

  componentDidMount() {
    // init questions + categories (if not previously inited)
    this.props.loadCategories();
    this.props.loadQuestions();
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    this.props.unloadQuestions();
  }
  
  render() {
    // TODO: Actions!
    const gotoNextQuestion = ...;
    const gotoPreviousQuestion = ...;
    const getQuizById = ...;
    const getQuestionById = ...;


    const quizId = this.props.params.quizId;
    const questionId = this.props.params.questionId;

    // TODO: State!
    const quiz = getQuiz(quizId);
    if (!quiz) {
      // TODO!
    }

    const question = getQuestionById(questionId);
    if (!question) {
      // TODO!
    }


    const QuizResponseMenuArgs = {};
    
    const navBtnStyle = {
      width: '50%'
    };
    
    const mainStyle = {
      minHeight: '400px'
    };



    const questionDOM = renderData(question,
      () => (<FAIcon name="cog" spinning={true} />),
      () => (<Well>no questions added</Well>),
      () => (
          <div className="quiz-main" style={mainStyle}>
            <QuizQuestion question={question} />
          </div>
          <QuizResponseMenu className="quiz-response-menu"
            {...QuizResponseMenuArgs}>
          </QuizResponseMenu>
        )
    );
    
    return (<div className="quiz-wrapper flex-row-multi">
        {questionDOM}
        <footer className="footer" style={{position: 'relative'}}>
          <div className="some-margin2" />
          <div>
            <Button style={navBtnStyle}
              bsStyle="primary" bsSize="large"
              onClick={gotoPreviousQuestion}>&lt;&lt;&lt;</Button>
            <Button  style={navBtnStyle}
              bsStyle="primary" bsSize="large"
              onClick={gotoNextQuestion}>>>></Button>
          </div>
        </footer>
      </div>
    );
  }
}