// import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
// import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
// import { firebase, helpers } from 'redux-react-firebase';
// //import _ from 'lodash';

// import { 
//   ConceptsRef,
//   ConceptTreeRef,
//   ConceptProgressRef,
//   ConceptResponsesRef
// } from 'src/core/concepts/';

// import { FAIcon } from 'src/views/components/util';
// import Markdown from 'src/views/components/markdown';


// const { isEmpty } = helpers;

// const EmptyObject = {};

// export class ConceptProgressBar extends React.Component {
//   static propTypes = {
//     concept: PropTypes.object.isRequired,
//     problem: PropTypes.object,

//     conceptsRef: PropTypes.object.isRequired,
//     problemsRef: PropTypes.object.isRequired,
//     responsesRef: PropTypes.object.isRequired,
//     progressRef: PropTypes.object.isRequired
//   };

//   render() {
//     const {
//       concept, problem, conceptsRef, problemsRef, responsesRef, progressRef,
//       gotoPreviousProblem, gotoNextProblem
//     } = this.props;
//     const navBtnStyle = EmptyObject;
//     const disabled = !problem;

//     return (<div>
//       <Well className="no-margin">
//         <h3 className="no-margin inline">{concept.title}</h3>

//         <span className="margin-half" />

//         <Button style={navBtnStyle}
//           bsStyle="primary" bsSize="small" disabled={disabled}
//           onClick={gotoPreviousProblem}>&lt;&lt;&lt;</Button>

//         <span className="margin-half" />

//         <Button  style={navBtnStyle}
//           bsStyle="primary" bsSize="small" disabled={disabled}
//           onClick={gotoNextProblem}>>>></Button>
//       </Well>
//     </div>);
//   }
// }


// export class ChildConcept extends React.Component {
//   static contextTypes = {
//     lookupLocalized: PropTypes.func.isRequired
//   };

//   static propTypes = {
//     problem: PropTypes.object
//   };

//   render () {
//     // data
//     if (!this.props.problem) {
//       throw new Error('problem prop must be supplied before rendering');
//     }
  
//     const { lookupLocalized } = this.context;
//     const { problem } = this.props;
//     const title = lookupLocalized(problem, 'title');
//     const description = lookupLocalized(problem, 'description');
    

//     // go render!
//     const ConceptResponseMenuArgs = EmptyObject;
//     const mainStyle = {
//       minHeight: '400px'
//     };
//     const jumboStyle = {
//       fontSize: '2em',
      
//       height: '100%', 
//       display: 'flex', 
//       flex: '1 100%', 
//       flexFlow: 'column',
//       backgroundColor: 'white'
//     };
//     const titleStyle = {
//       marginTop: 0
//     };
    
//     return (<div>
//       <div className="concept-main" style={mainStyle}>
//         <Jumbotron className="no-margin"style={jumboStyle}>
//             <div style={{flex: '8 auto'}}>
//               <h2 style={titleStyle}>{title}</h2>
//               <Markdown source={description} />
//             </div>
//             <div style={{flex: '1 auto', position: 'relative'}}>
//               <textarea placeholder="小筆記" 
//                 disabled
//                 rows="2"
//                 style={{width: '100%', 
//                   display:'block'}}></textarea>
//             </div>
//         </Jumbotron>
//       </div>
//       <ConceptResponseMenu className="concept-response-menu"
//         {...ConceptResponseMenuArgs}>
//       </ConceptResponseMenu>
//     </div>);
//   }
// }

// class ConceptResponseMenu extends React.Component {
//   render() {
//     return (<div className="concept-response-menu">
//       <Button
//           block bsSize="large" bsStyle="warning"
//           //onClick={}
//           >我看懂題目，但不知道怎麼找答案</Button>
//       <Button
//           block bsSize="large" bsStyle="info"
//           //onClick={}
//           >我知道答案，剛剛去查</Button>
//       <Button
//           block bsSize="large" bsStyle="success"
//           //onClick={}
//           >我早就知道答案，這次不需要查！</Button>
//       <Button style={{visibility: 'hidden'}}
//           block bsSize="large"
//           >filler</Button>
//       <Button
//           block bsSize="large" bsStyle="default"
//           //onClick={}
//           >我看不懂題目</Button>
//       <Button
//           block bsStyle="danger" bsSize="large"
//           //onClick={}
//           >我覺得這題目有問題</Button>
//     </div>);
//   }
// }


// @firebase(({ params }, firebase) => ([
//   ConceptsRef.makeQuery(),
//   //ConceptTreeRef.makeQuery(),
//   ConceptResponsesRef.makeQuery(),
//   ConceptProgressRef.makeQuery()
// ]))
// @connect(
//   ({ firebase }) => {
//     return {
//       conceptsRef: ConceptsRef(firebase),
//       //conceptTreeRef: ConceptTreeRef(firebase),
//       responsesRef: ConceptResponsesRef(firebase),
//       progressRef: ConceptProgressRef(firebase)
//     };
//   }
// )
// export class ConceptPlayPage extends Component {
//   static contextTypes = {
//     router: React.PropTypes.object.isRequired
//   };

//   static propTypes = {
//     firebase: PropTypes.object.isRequired,
//     params: PropTypes.object.isRequired,

//     conceptsRef: PropTypes.object.isRequired,
//     problemsRef: PropTypes.object.isRequired,
//     responsesRef: PropTypes.object.isRequired,
//     progressRef: PropTypes.object.isRequired
//   };

//   componentDidMount() {
//   }

//   componentWillReceiveProps(nextProps) {
//   }

//   shouldComponentUpdate(nextProps) {
//     return true;
//   }

//   componentWillUnmount() {
//   }
  
//   render() {
//     // get basic data + wrappers
//     const { router } = this.context;
//     const { conceptsRef, problemsRef, responsesRef, progressRef, children } = this.props;
//     let { conceptId, problemId } = this.props.params;

//     // prepare all actions
//     const getConceptById = conceptsRef.concept.bind(conceptsRef);
//     const getProblemById = problemsRef.problem.bind(problemsRef);
//     const getFirstProblemId = problemsRef.getFirstProblemId.bind(problemsRef);
//     const getFirstProblem = problemsRef.getFirstProblem.bind(problemsRef);
//     const gotoProblem = (newProblemId) => {
//       if (newProblemId) {
//         router.replace(`/concept-play/${conceptId}/problem/${newProblemId}`);
//       }
//     };
//     const gotoFirstProblem = () => {
//       const newProblemId = getFirstProblemId(conceptId);
//       setTimeout(() => gotoProblem(newProblemId), 1000);
//     };

//     const gotoNextProblem = () => {
//       const newId = problemsRef.getNextProblemId(conceptId, problemId);
//       gotoProblem(newId);
//     };
//     const gotoPreviousProblem = () => {
//       const newId = problemsRef.getPreviousProblemId(conceptId, problemId);
//       gotoProblem(newId);
//     };
//     const gotoRoot = router.replace.bind(router, '/');

//     // get derived data
//     const childConcepts = problemsRef.ofConcept(conceptId);
//     const isBusy = !conceptsRef.isLoaded;
//     const hasProblems = !isEmpty(childConcepts);
//     problemId = problemId || getFirstProblemId(conceptId);
//     const problem = problemId && getProblemById(conceptId, problemId);


//     // go!
//     if (isBusy) {
//       // still loading
//       return (<FAIcon name="cog" spinning={true} />);
//     }

//     const concept = getConceptById(conceptId);
//     if (!concept) {
//       // invalid concept id
//       return (<Alert bsStyle="danger">invalid conceptId <Button onClick={gotoRoot}>go back</Button></Alert>);
//     }

//     let contentEl;
//     if (!problem) {
//       // concept has no problems at all
//       contentEl = (<Alert bsStyle="info">concept is empty</Alert>);
//     }
//     else {
//       // render current problem
//       contentEl = (<ChildConcept problem={problem} />);
//     }

//     return (
//       <div className="concept-wrapper flex-row-multi">
//         <ConceptProgressBar concept={concept} problem={problem} 
//           conceptsRef={conceptsRef} problemsRef={problemsRef}
//           progressRef={progressRef} responsesRef={responsesRef}
//           gotoNextProblem={gotoNextProblem}
//           gotoPreviousProblem={gotoPreviousProblem} />
//         { contentEl }
//       </div>
//     );
//   }
// }