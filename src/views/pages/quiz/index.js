import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { Button, Jumbotron, Well } from 'react-bootstrap';
import _ from 'lodash';

import { FAIcon } from 'src/views/components/util';

import ScratchVM from 'src/core/scratch/ScratchVM';

import { firebase, helpers } from 'redux-react-firebase'
const { isLoaded, isEmpty, dataToJS } = helpers;


// simple stand-alone Workspace to just render a bunch of code
class InlineScratchWorkspace extends React.Component {
  onWorkspaceRef(el) {
    this.workspaceEl = el;
  }
  
  componentDidMount() {
    //const canvasEl = this.refs.canvas;
    const defaultWorkspaceConfig = {
      divEl: this.workspaceEl,
      cfg: {
        readOnly: true,
        zoom: { controls: false }
      }
    };
    
    const workspaceCfgProps = this.props.workspaceConfig;
    const workspaceCfg = _.merge(defaultWorkspaceConfig,
                                 workspaceCfgProps);
    this.scratchVM = new ScratchVM(workspaceCfg);
    const vm = this.scratchVM;
    
    if (this.props.xml) {
      vm.loadXml(this.props.xml);
    }
    else if (this.props.simpleCode) {
      vm.loadSimpleCode(this.props.simpleCode);
    }
    
    this.resizeToFit();
  }
  
  resizeToFit() {
    // see: https://github.com/google/blockly/blob/c0c43596615d714c745290078f5408200d382fa2/demos/blockfactory/block_option.js#L140
    // Get metrics
    const workspace = this.scratchVM.workspace;
    const metrics = workspace.getMetrics();
    const bounds = workspace.getBlocksBoundingBox();
    
    const $el = $(this.workspaceEl);
    const w = bounds.width * workspace.scale;
    const h = bounds.height * workspace.scale;
    $el.innerWidth(w);
    $el.innerHeight(h);
    
    // trigger resize event to get Blockly to revalidate its layout
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0); 
    window.dispatchEvent(evt);
  }
  
  render() {
    const style = {
      'marginLeft': '0.5em',
      'marginRight': '0.5em',
      width: '480px', 
      height: '360px', 
      display: 'inline-block'
    };
    return (
      <div ref={this.onWorkspaceRef.bind(this)}
        style={style}>
      </div>);
  }
}

class ScratchMarkdown extends React.Component {
  textToComponents(text, comps) {
    let lastKey = 0;
    function makeKey(text) {
      return text + (++lastKey);
    }
    function textNode(text) {
      const style = {
        //display: 'inline-block'
      };
      return (<span key={makeKey(text)} style={style}>{text}</span>);
    }

    function codeNode(text) {
      return (<InlineScratchWorkspace key={makeKey(text)} simpleCode={text} />);
    }

    try {
      const re = /\{\{([^}]+)\}\}/g;
      let lastIndex = 0;
      let match;
      while ((match = re.exec(text)) != null) {
        const matchStart = match.index, matchEnd = re.lastIndex;
        let prevText = text.substring(lastIndex, matchStart);
        let matchText = match[1];

        comps.push(textNode(prevText));
        comps.push(codeNode(matchText));

        lastIndex = matchEnd;
      }

      let prevText = text.substring(lastIndex, text.length);
      comps.push(textNode(prevText));
    }
    catch (err) {
      console.error('Invalid string: ' + text);
      console.error(err.stack);
    }
    return comps;
  }
  
  render() {
    const style = {
      'verticalAlign': 'middle'
    };
    const text = this.props.text;
    const comps = [];
    this.textToComponents(text, comps);
    return <div style={style}>{comps}</div>;
  }
}

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
    laodCategories: PropTypes.func.isRequired,
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
    const question = getQuestionById(questionId);


    const QuizResponseMenuArgs = {};
    
    const navBtnStyle = {
      width: '50%'
    };
    
    const mainStyle = {
      minHeight: '400px'
    };



    const questionDOM = (!isLoaded(question) ?
      (<FAIcon name="cog" spinning={true}>) 
      : (isEmpty(question) ? 
        <Well>no questions added</Well>
        : (
          <div className="quiz-main" style={mainStyle}>
            <QuizQuestion question={question} />
          </div>
          <QuizResponseMenu className="quiz-response-menu"
            {...QuizResponseMenuArgs}>
          </QuizResponseMenu>
        )
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
      </div>);
  }
}