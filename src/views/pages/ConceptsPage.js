import { 
  ConceptsRef,
  ConceptChecksRef,
  ConceptProgressRef,
  ConceptResponsesRef
} from 'src/core/concepts/';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Promise } from 'firebase';
import { firebase } from 'redux-react-firebase';
import {
  Alert, Button, Jumbotron,
  Grid, Row, Col
} from 'react-bootstrap';
import { Link } from 'react-router';
import {
  LinkContainer
} from 'react-router-bootstrap';

import { hrefConceptView } from 'src/views/href';

import { FAIcon } from 'src/views/components/util';

import { LoadOverlay } from 'src/views/components/overlays';

import {
  ConceptPlayView,
  ConceptPlayViewControls,
  ConceptGrid,
  ConceptBreadcrumbs
} from 'src/views/components/concept';

import Markdown from 'src/views/components/markdown';

import {
  ConceptEditTools,
  ConceptEditor,
  AddConceptEditor
} from 'src/views/components/concept-editor';

import _ from 'lodash';


@firebase((props, firebase) => {
  const { params } = props;
  const queries = [
    ConceptsRef.makeQuery(params.ownerId),
    ConceptResponsesRef.makeQuery(),
    ConceptProgressRef.makeQuery()
  ];

  if (params.conceptId) {
    const args = { conceptId: params.conceptId };
    queries.push(ConceptChecksRef.ofConcept.makeQuery(args));
  }

  return queries;
})
@connect(
    ({ firebase }, props) => {
      const { params } = props;
      const checkArgs = { conceptId: params.conceptId || 0 };

    return {
      conceptsRef: ConceptsRef(firebase),
      //UserInfoRef.user(firebase, {auth, uid: auth.uid});
      conceptChecksRef: ConceptChecksRef.ofConcept(firebase, checkArgs)
    };
  }
)
export default class ConceptsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    conceptsRef: PropTypes.object.isRequired,
    conceptChecksRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false
    };
    this.toggleAdding = this.toggleAdding.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  get isAddMode() {
    const { params } = this.props;
    return params.mode === 'add';
  }

  get isEditMode() {
    const { params } = this.props;
    return params.mode === 'edit';
  }

  setEditMode(mode) {
    const { router } = this.context;
    const { params } = this.props;
    let { ownerId, conceptId } = params;

    router.replace(hrefConceptView(ownerId, conceptId, mode));
  }

  setAdding(adding) {
    this.setEditMode(adding ? 'add' : '');
  }

  toggleAdding() {
    this.setAdding(!this.isAddMode);
  }

  toggleEdit() {
    this.setEditMode(this.isEditMode ? '' : 'edit');
  }

  wrapPromise(promise) {
    //this.setState({busy: true});
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
    const { userInfoRef, router, lookupLocalized } = this.context;
    const { conceptsRef, conceptChecksRef, params } = this.props;
    const isAdmin = userInfoRef && userInfoRef.adminDisplayMode() || false;
    const userPrefs = userInfoRef && userInfoRef.prefs() || {};
    const mayEdit = isAdmin;
    const notLoadedYet = !conceptsRef.isLoaded;
    const busy = this.state.busy;
    let { ownerId, conceptId } = params;

    const isRoot = !ownerId && !conceptId;
    ownerId = !isRoot && ownerId || null;
    conceptId = !isRoot && conceptId || null;

    const ownerConcept = !isRoot && conceptsRef.concept(ownerId) || null;
    const currentConcept = !isRoot && conceptsRef.concept(conceptId) || null;
    const parentId = !isRoot && currentConcept && currentConcept.parentId || null;

    const ownerConcepts = conceptsRef.getRootConcepts(isAdmin);
    const childConcepts = isRoot && 
      ownerConcepts ||  // root concepts
      conceptsRef.getChildren(conceptId, isAdmin);

    const conceptChecks = currentConcept && conceptChecksRef.val;

    // prepare actions
    const gotoRoot = router.replace.bind(router, '/');
    const addConcept = ({ concept }) => {
      // TODO: Use transaction to avoid race condition
      const lastConcept = childConcepts && _.maxBy(Object.values(childConcepts), 'num') || null;
      const previousNum = lastConcept && lastConcept.num || 0;
      concept.num = parseInt(previousNum) + 1;
      concept.parentId = isRoot ? null : conceptId;

      const newRef = conceptsRef.add_concept(concept);
      const newOwnerId = isRoot ? newRef.key : ownerId;
      newRef.update({ownerId: newOwnerId});

      this.setAdding(false);

      return this.wrapPromise(newRef)
        //.then(() => this.setAdding(false));
    };
    const updateConcept = ({ conceptId, concept, checks }) => {
      return this.wrapPromise(Promise.all([
        conceptsRef.set_concept(conceptId, concept),
        conceptChecksRef.set(checks)
      ]));
    };
    const deleteConcept = (deleteConceptId) => {
      // TODO: Don't delete if it still has children!?
      return this.wrapPromise(conceptsRef.deleteConcept(deleteConceptId))
        .then(() => {
          if (deleteConceptId === conceptId) {
            // deleted current concept -> Go to parent

          }
        });
    };
    const toggleConceptPublic = (conceptId) => {
      return this.wrapPromise(conceptsRef.togglePublic(conceptId));
    };
    const updateUserPrefs = (prefs) => {
      return this.wrapPromise(userInfoRef.update_prefs(prefs));
    };

    const conceptActions = !mayEdit && {} || {
      updateConcept, deleteConcept, toggleConceptPublic
    };

    // go render!
    if (notLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (conceptId && !currentConcept) {
      //setTimeout(() => router.replace('/'), 3000);
      return (<Alert bsStyle="danger">
        invalid conceptId
        <Button onClick={gotoRoot}>go home</Button>
      </Alert>);
    }

    const titleEl = (<ConceptBreadcrumbs ownerConcepts={ownerConcepts} currentConceptId={conceptId} />);

    // elements
    let toolsEl, conceptEditorEl;
    if (mayEdit) {
      const conceptArgs = {
        ownerId, parentId, conceptId,
        concept: currentConcept,
        conceptChecks
      };

      let basicToolsEl;
      if (!isRoot) {
        basicToolsEl = (<ConceptEditTools
          {...conceptArgs}
          {...{ 
            conceptActions,
            editing: this.isEditMode,
            toggleEdit: this.toggleEdit }} />);
      }

      const addButtonEl = (
        <Button active={this.isAddMode}
          bsStyle="success" bsSize="small" onClick={this.toggleAdding}>
          <FAIcon name="plus" className="color-green" /> add new concept
        </Button>
      );

      toolsEl = (<span>
        { basicToolsEl }
        { addButtonEl }
      </span>);

      if (this.isAddMode) {
        conceptEditorEl = (
          <AddConceptEditor busy={busy} addConcept={addConcept}>
          </AddConceptEditor>
        );
      }
      else if (this.isEditMode) {
        conceptEditorEl = (
          <ConceptEditor busy={busy} onSubmit={updateConcept} {...conceptArgs}></ConceptEditor>
        );
      }
    }

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    const childConceptsEl = (!childConcepts || _.isEmpty(childConcepts)) ? (
      // no childConcepts
      <Alert bsStyle="info">concept has no children</Alert>
    ) : (
      // display childConcepts
      <ConceptGrid {...{
        busy, ownerId, parentId: conceptId, concepts: childConcepts, mayEdit, conceptActions
      }} />
    );

    // render!
    return (
      <div>
        <h3>
          {titleEl} {toolsEl}
          { currentConcept && <ConceptPlayViewControls
              userPrefs={userPrefs}
              updateUserPrefs={updateUserPrefs} /> }
        </h3>
        { conceptEditorEl }
        { errEl }
        { currentConcept && <ConceptPlayView 
            concept={currentConcept} conceptChecks={conceptChecks} 
            userPrefs={userPrefs} /> }
        { childConceptsEl }
      </div>
    );
  }
} 