import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip
} from 'react-bootstrap';

import { UserInfoRef } from 'src/core/users';
import { 
  ConceptsRef, 
  ChildConceptsRef,
  ConceptProgressRef,
  ConceptResponsesRef
} from 'src/core/concepts/';

import {
  ConceptGrid
} from 'src/views/components/concept';

import {
  ConceptInfoEditor,
  ConceptEditor,
  AddConceptEditor
} from 'src/views/components/concept-editor';

import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import _ from 'lodash';

@firebase((props, firebase) => ([
  ConceptsRef.path,
  ChildConceptsRef.path
]))
@connect(
  ({ firebase }) => ({
    conceptsRef: ConceptsRef(firebase),
    childConceptsRef: ChildConceptsRef(firebase)
  })
)
export default class ConceptViewPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    conceptsRef: PropTypes.object.isRequired,
    childConceptsRef: PropTypes.object.isRequired
  }

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false,
      adding: false
    };
  }

  toggleAdding() {
    this.setState({ 
      adding: !this.state.adding,
      editingConcept: false
    });
  }

  toggleEditing() {
    this.setState({ 
      editingConcept: !this.state.editingConcept,
      adding: false
    });
  }

  wrapPromise(promise) {
    return promise
    .then(() => {
      this.setState({busy: false, error: null});
    })
    .catch((err) => {
      this.setState({busy: false, error: err});
    });
  }

  render() {
    // prepare data
    const { userInfo, router, lookupLocalized } = this.context;  
    const { conceptsRef, childConceptsRef, params } = this.props;
    const mayEdit = userInfo && userInfo.adminDisplayMode() || false;
    const notLoadedYet = !conceptsRef.isLoaded;
    const busy = this.state.busy;
    const { conceptId } = params;
    const concept = conceptsRef.concept(conceptId);
    const childConcepts = childConceptsRef.ofConcept(conceptId);

    // prepare actions
    const gotoRoot = router.replace.bind(router, '/');
    const addConcept = ({ concept }) => {
      // TODO: Use transaction to avoid race condition
      const lastProblem = childConcepts && _.maxBy(Object.values(childConcepts), 'num') || null;
      problem.num = (lastProblem && lastProblem.num || 0)  + 1;
      return this.wrapPromise(childConceptsRef.add_concept(conceptId, problem));
    };
    const updateConcept = ({conceptId, concept}) => {
      return this.wrapPromise(conceptsRef.update_concept(conceptId, concept));
    };
    const updateProblem = ({ problemId, problem }) => {
      return this.wrapPromise(childConceptsRef.update_problem(conceptId, problemId, problem));
    };
    const deleteProblemId = (problemId) => {
      return this.wrapPromise(childConceptsRef.deleteProblem(conceptId, problemId));
    };

    // go render!
    if (notLoadedYet) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (!concept) {
      //setTimeout(() => router.replace('/'), 3000);
      return (<Alert bsStyle="danger">invalid conceptId <Button onClick={gotoRoot}>go back</Button></Alert>);
    }

    const conceptTitle = lookupLocalized(concept, 'title');

    // elements
    let tools, topEditors;
    if (mayEdit) {
      tools = (<span>
        <Button active={this.state.editingConcept} 
          bsStyle="success" bsSize="small" onClick={this.toggleEditing.bind(this)}>
          <FAIcon name="pencil" className="" />
        </Button>
        <Button active={this.state.adding} 
          bsStyle="success" bsSize="small" onClick={this.toggleAdding.bind(this)}>
          <FAIcon name="plus" className="color-green" /> add new problem
        </Button>
      </span>);
      if (this.state.adding) {
        topEditors = (
          <AddConceptEditor busy={busy} concept={concept} addConcept={addConcept}>
          </AddConceptEditor>
        );
      }
      if (this.state.editingConcept) {
        topEditors = (
          <ConceptInfoEditor conceptId={conceptId} concept={concept} onSubmit={updateConcept}></ConceptInfoEditor>
        );
      }
    }

    const childConceptsEl = !childConcepts ? (
      // no childConcepts
      <Alert bsStyle="info">concept is empty</Alert>
    ) : (
      // display childConcepts
      <div><ConceptGrid {...{
        busy, conceptId, childConcepts, mayEdit, updateProblem, deleteProblemId
      }} /></div>
    );

    //console.log(childConcepts && _.map(childConcepts, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{conceptTitle} {tools}</h3>
        { topEditors }
        { errEl }
        { childConceptsEl }
      </div>
    );
  }
}
