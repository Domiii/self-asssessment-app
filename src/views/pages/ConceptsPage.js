import { 
  ConceptsRef,
  ConceptChecksRef,
  ConceptResponsesRef,
  ConceptCheckResponsesRef,

  computeAllChecksProgress
} from 'src/core/concepts/';

import autoBind from 'react-autobind';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Firebase, { Promise } from 'firebase';
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

const EmptyObject = Object.freeze({});

@firebase((props, firebase) => {
  const { params } = props;
  const queries = [
    ConceptsRef.makeQuery(params.ownerId)
  ];

  if (params.conceptId) {
    const conceptId = params.conceptId;
    queries.push(ConceptChecksRef.ofConcept.makeQuery({conceptId}));

    const uid = Firebase._.authUid;
    queries.push(ConceptCheckResponsesRef.ofUser.makeQuery({uid}));
  }

  return queries;
})
@connect(
    ({ firebase }, props) => {
      const { params } = props;
      const checkArgs = { conceptId: params.conceptId || 0 };
      const responsesRefArgs = { uid: Firebase._.authUid };

      return {
        conceptsRef: ConceptsRef(firebase),
        //UserInfoRef.user(firebase, {auth, uid: auth.uid});
        conceptChecksRef: ConceptChecksRef.ofConcept(firebase, checkArgs),
        conceptCheckResponsesRef: ConceptCheckResponsesRef.ofUser(firebase, responsesRefArgs)
      };
  }
)
export default class ConceptsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    conceptsRef: PropTypes.object.isRequired,
    conceptChecksRef: PropTypes.object.isRequired,
    conceptCheckResponsesRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false
    };

    autoBind(this);
  }

  // ###################################################
  // General stuff
  // ###################################################

  get isNotLoadedYet() {
    const { conceptsRef } = this.context;
    return !conceptsRef.isLoaded;
  }

  // indicates whether the application is currently still processing an operation
  get isBusy() {
    return this.state.busy;
  }

  get isAdmin() {
    const { userInfoRef } = this.context;
    return userInfoRef && userInfoRef.adminDisplayMode() || false;
  }

  get mayEdit() {
    return this.isAdmin;
  }

  get userPrefs() {
    const { userInfoRef } = this.context;
    return userInfoRef && userInfoRef.prefs() || EmptyObject;
  }

  get currentConceptId() {
    const { params } = this.props;
    const { conceptId } = params;

    return !this.isRoot && conceptId || null;
  }

  get currentOwnerId() {
    const { params } = this.props;
    const { ownerId } = params;

    return !this.isRoot && ownerId || null;
  }

  get isRoot() {
    const { params } = this.props;
    const { ownerId, conceptId } = params;
    return !ownerId && !conceptId;
  }

  gotoRoot() {
    const { router } = this.context;
    router.replace('/');
  }

  wrapPromise(promise) {
    //this.setState({busy: true});
    return promise
    .then(() => {
      this.setState({busy: false, error: null});
    })
    .catch((err) => {
      console.error(err);
      this.setState({busy: false, error: err});
    });
  }

  // ###################################################
  // Privileged actions
  // ###################################################

  // all kinds of action wrappers
  addConcept({ concept }) {
    // const ownerId, parentId, siblings = ...;
    const { conceptsRef } = this.props;
    const parentId = this.currentConceptId;
    const siblings = ...;

    // TODO: Use transaction to avoid race condition
    const lastConcept = siblings && 
      _.maxBy(Object.values(siblings), 'num') || null;
    const previousNum = lastConcept && lastConcept.num || 0;
    concept.num = parseInt(previousNum) + 1;
    concept.parentId = parentId;

    // create new concept entry
    const newRef = conceptsRef.add_concept(concept);

    // update ownerId
    const ownerId = this.currentOwnerId || 
      newRef.key;  // ownerId is either given ownerId or self
    const ownerUpdate = newRef.update({ownerId});

    this.setAdding(false);

    return this.wrapPromise(Promise.all([newRef, ownerUpdate]))
      //.then(() => this.setAdding(false));
  }

  updateConcept({ conceptId, concept, checks }) {
    const { conceptsRef, conceptChecksRef } = this.props;

    concept.nChecks = _.size(checks);
    return this.wrapPromise(Promise.all([
      conceptsRef.set_concept(conceptId, concept),
      conceptChecksRef.update(checks)
    ]));
  }

  deleteConcept(deleteConceptId) {
    const { conceptsRef } = this.props;

    // TODO: Don't delete if it still has children!?
    return this.wrapPromise(conceptsRef.deleteConcept(deleteConceptId))
      .then(() => {
        //if (deleteConceptId === conceptId) {
          // deleted current concept -> Go to parent
        // }
      });
  }

  toggleConceptPublic(conceptId) {
    const { conceptsRef } = this.props;

    return this.wrapPromise(conceptsRef.togglePublic(conceptId));
  }

  addConceptCheck(conceptId) {
    const { conceptsRef, conceptChecksRef } = this.props;
    const conceptChecks = conceptChecksRef.val;

    const newCheck = {};
    const lastCheck = conceptChecks && 
      _.maxBy(Object.values(conceptChecks), 'num') || null;
    const previousNum = lastCheck 
      && lastCheck.num || 0;

    newCheck.num = parseInt(previousNum) + 1;

    return this.wrapPromise(
      conceptChecksRef.add_conceptCheck(newCheck)
      .then(conceptsRef.update_concept(conceptId, 
        {nChecks: conceptChecks && _.size(conceptChecks) || 0}))
    );
  }

  deleteConceptCheck(conceptId, conceptCheckId) {
    const { conceptsRef, conceptChecksRef } = this.props;
    const conceptChecks = conceptChecksRef.val;

    return this.wrapPromise(
      conceptChecksRef.delete_conceptCheck(conceptCheckId)
      .then(conceptsRef.update_concept(conceptId, 
        {nChecks: conceptChecks && _.size(conceptChecks) || 0}))
    );
  }


  // ###################################################
  // User actions
  // ###################################################
  updateUserPrefs(prefs){
    const { userInfoRef } = this.props;
    return this.wrapPromise(userInfoRef.update_prefs(prefs));
  }

  updateCheckResponse(conceptId, checkId, responseName, response) {
    const { conceptCheckResponsesRef } = this.props;

    return this.wrapPromise(
      conceptCheckResponsesRef.updateResponse(
        conceptId, checkId, responseName, response));
  }
  

  // ###################################################
  // Editing
  // ###################################################

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


  // ###################################################
  // Render
  // ###################################################

  render() {
    if (!this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (this.isRoot) {
      const rootConcepts = conceptsRef.getRootConcepts(isAdmin);

    }
    else {
      const currentConcept = conceptsRef.concept(conceptId);
      const ownerConcept = conceptsRef.concept(ownerId);
      if (!currentConcept || !ownerConcept) {
        return (<Alert bsStyle="danger">
          invalid concept
          <Button onClick={this.gotoRoot}>go home</Button>
        </Alert>);
      }

      const ownerConcepts = conceptsRef.getRootConcepts(isAdmin);
      const childConcepts = conceptsRef.getChildren(conceptId, isAdmin);

      const parentId = currentConcept.parentId;
      const conceptChecks = conceptChecksRef.val;
      const conceptCheckResponses = conceptCheckResponsesRef.ofConcept(conceptId);
      const conceptProgress = 
        computeAllChecksProgress(ownerConcepts, conceptCheckResponsesRef.val) || EmptyObject;


    }

    // prepare actions

    // go render!

    // elements
    const conceptActions = !this.mayEdit && EmptyObject || {
      addConceptCheck, deleteConceptCheck, 
      updateConcept, deleteConcept, 
      toggleConceptPublic
    };
    let toolsEl, conceptEditorEl;
    if (this.mayEdit) {
      const conceptArgs = {
        ownerId, parentId, conceptId,
        concept: currentConcept,
        conceptChecks
      };

      let currentConceptEditTools;
      if (!this.isRoot) {
        currentConceptEditTools = (<ConceptEditTools
          {...conceptArgs}
          {...{ 
            conceptActions,
            editing: this.isEditMode,
            toggleEdit: this.toggleEdit }} />);
      }

      const addButtonEl = (
        <Button active={this.isAddMode}
          bsStyle="success" bsSize="small" onClick={this.toggleAdding}>
          <FAIcon name="plus" className="color-green" /> add new entry
        </Button>
      );

      toolsEl = (<span>
        { currentConceptEditTools }
        { addButtonEl }
      </span>);

      if (this.isAddMode) {
        conceptEditorEl = (
          <AddConceptEditor {...{
            busy, addConcept
          }} />
        );
      }
      else if (this.isEditMode) {
        conceptEditorEl = (
          <ConceptEditor busy={busy}
            onSubmit={updateConcept} {...conceptArgs} {...conceptActions}>
          </ConceptEditor>
        );
      }
    }

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger"><pre>{this.state.error.stack || this.state.error}</pre></Alert>
    );

    const childConceptsEl = (!childConcepts || _.isEmpty(childConcepts)) ? (
      // no childConcepts
      <Alert bsStyle="info">concept has no children</Alert>
    ) : (
      // display childConcepts
      <ConceptGrid {...{
        busy, ownerId, parentId: conceptId, 
        concepts: childConcepts, conceptProgress,
        mayEdit, conceptActions
      }} />
    );

    // render!
    return (
      <div>
        <h3>
          <div>
            <ConceptBreadcrumbs 
              ownerConcepts={ownerConcepts} 
              currentConceptId={this.currentConceptId} />

            {toolsEl}
          </div>
          <div>
            { currentConcept && <ConceptPlayViewControls
              userPrefs={userPrefs}
              updateUserPrefs={updateUserPrefs} /> }
          </div>
        </h3>
        { errEl }
        { conceptEditorEl }
        { currentConcept && <ConceptPlayView 
          {...{
            conceptId,
            concept: currentConcept,
            userPrefs,
            conceptChecks,
            conceptCheckResponses,
            conceptProgress,
            updateCheckResponse
          }} /> }
        { childConceptsEl }
      </div>
    );
  }
} 