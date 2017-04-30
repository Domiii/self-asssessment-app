import { 
  ConceptsRef,
  ConceptChecksRef,
  ConceptResponsesRef,
  ConceptCheckResponsesRef,
  ConceptCheckResponseDetailsRef,

  computeAllChecksProgress
} from 'src/core/concepts/';

import {
  NotificationsRef
}
from 'src/core/log';

import autoBind from 'react-autobind';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Firebase, { Promise } from 'firebase';
import { firebase } from 'redux-react-firebase';
import {
  Alert, Button, Jumbotron,
  Grid, Row, Col
} from 'react-bootstrap';

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

import { EmptyObject, EmptyArray } from 'src/util';

@firebase((props, firebase) => {
  const { params } = props;
  const queries = [
    ConceptsRef.makeQuery(params.ownerId)
  ];

  if (params.conceptId) {
    const conceptId = params.conceptId;
    const uid = Firebase._.authUid;
    const conceptResponseArgs = { responseId: {uid, conceptId} };

    queries.push(ConceptChecksRef.ofConcept.makeQuery({conceptId}));
    queries.push(ConceptResponsesRef.response.makeQuery(conceptResponseArgs));
    queries.push(ConceptCheckResponsesRef.makeQuery({uid}));
    queries.push(ConceptCheckResponseDetailsRef.makeQuery({uid, conceptId}));
  }

  return queries;
})
@connect(({ firebase }, props) => {
  const { params } = props;
  const uid = Firebase._.authUid;
  const conceptId = params.conceptId;

  const refs = {
    conceptsRef: ConceptsRef(firebase),
    notificationsRef: NotificationsRef(firebase, { uid })
  };

  if (conceptId) {
    const conceptResponseArgs = { uid, conceptId };
    const conceptResponsePathArgs = { responseId: {uid, conceptId} };
    const checkArgs = { conceptId: conceptId || 0 };
    const checkResponsesArgs = { uid };
    const checkResponsesDetailsArgs = { uid, conceptId };

    Object.assign(refs, {
      //UserInfoRef.user(firebase, {auth, uid: auth.uid});
      conceptResponsesRef: ConceptResponsesRef.response(firebase, conceptResponseArgs, conceptResponsePathArgs),
      conceptChecksRef: ConceptChecksRef.ofConcept(firebase, checkArgs),
      conceptCheckResponsesRef: ConceptCheckResponsesRef(firebase, checkResponsesArgs),
      conceptCheckResponseDetailsRef: ConceptCheckResponseDetailsRef(firebase, checkResponsesDetailsArgs)
    });
  }
  return refs;
})
export default class ConceptsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    conceptsRef: PropTypes.object.isRequired,
    conceptResponsesRef: PropTypes.object,
    conceptChecksRef: PropTypes.object,
    conceptCheckResponsesRef: PropTypes.object,
    conceptCheckResponseDetailsRef: PropTypes.object,

    notificationsRef: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false
    };

    autoBind(this);
  }



  // ###################################################
  // All kinds of data
  // ###################################################
  
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

  get currentConcept() {
    const { conceptsRef } = this.props;
    return this.currentConceptId && conceptsRef.concept(this.currentConceptId);
  }

  get currentOwnerConcept() {
    const { conceptsRef } = this.props;
    return this.currentOwnerId && conceptsRef.concept(this.currentOwnerId);
  }

  get currentLoadedConcepts() {
    const { conceptsRef } = this.props;
    return conceptsRef.getLoadedConcepts(this.isAdmin);
  }

  get currentChildConcepts() {
    const { conceptsRef } = this.props;
    if (this.currentConceptId) {
      return conceptsRef.getChildren(this.currentConceptId, this.isAdmin);
    }
    else {
      return this.currentLoadedConcepts;
    }
  }

  get currentParentId() {
    return this.currentConcept.parentId
  }

  get currentConceptChecks() {
    const { conceptChecksRef } = this.props;
    return conceptChecksRef.val;
  }

  get currentConceptResponse() {
    const { conceptResponsesRef } = this.props;
    return conceptResponsesRef && 
      conceptResponsesRef.val;
  }

  // all relevant responses by current user
  get currentCheckResponses() {
    const { conceptCheckResponsesRef } = this.props;
    return this.currentConceptId &&
      conceptCheckResponsesRef.ofConcept(this.currentConceptId) ||
      EmptyArray;
  }

  // response details of the currently selected conceptId, by current user
  get currentCheckResponseDetails() {
    const { conceptCheckResponseDetailsRef } = this.props;
    return conceptCheckResponseDetailsRef && 
      conceptCheckResponseDetailsRef.val ||
      EmptyObject;
  }

  computeCurrentConceptProgress() {
    const { conceptCheckResponsesRef } = this.props;

    return conceptCheckResponsesRef && computeAllChecksProgress(
      this.currentLoadedConcepts,
      conceptCheckResponsesRef.val || EmptyObject) || EmptyObject;
  }


  // ###################################################
  // General stuff
  // ###################################################

  get isNotLoadedYet() {
    const { conceptsRef } = this.props;
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

  get areParamsValid() {
    const { conceptsRef } = this.props;
    const conceptId = this.currentConceptId, ownerId = this.currentOwnerId;
    const currentConcept = conceptId && conceptsRef.concept(conceptId);
    const ownerConcept = ownerId && conceptsRef.concept(ownerId);
    const hasConceptParams = currentConcept && ownerConcept;

    return (this.isRoot !== hasConceptParams) && 
      (!!currentConcept === !!ownerConcept) &&
      (!!conceptId === !!currentConcept) &&
      (!!ownerId === !!ownerConcept);
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
    const { conceptsRef } = this.props;
    const parentId = this.currentConceptId;
    const siblings = conceptsRef.getAllChildren(parentId);

    // TODO: Use transaction to avoid race condition
    const lastConcept = siblings && 
      _.maxBy(Object.values(siblings), 'num') || null;
    const previousNum = lastConcept && lastConcept.num || 0;
    concept.num = parseInt(previousNum) + 1;
    concept.parentId = parentId;

    // create new concept entry

    // TODO: push_concept's then does not return the original reference
    const newRef = conceptsRef.push_concept(concept);

    // update ownerId
    const ownerId = this.currentOwnerId || 
      newRef.key;  // ownerId is either given ownerId or self
    const ownerUpdate = newRef.update({ownerId});

    this.setAdding(false);

    return this.wrapPromise(Promise.all([newRef, ownerUpdate]));
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

    const nChecks = 1 + (conceptChecks && _.size(conceptChecks) || 0);

    return this.wrapPromise(
      conceptChecksRef.push_conceptCheck(newCheck)
      .then(conceptsRef.update_concept(conceptId, {nChecks}))
    );
  }

  deleteConceptCheck(conceptId, conceptCheckId) {
    const { conceptsRef, conceptChecksRef } = this.props;
    const conceptChecks = conceptChecksRef.val;

    return this.wrapPromise(
      conceptChecksRef.delete_conceptCheck(conceptCheckId)
      .then(conceptsRef.update_concept(conceptId, 
        {nChecks: conceptChecks && _.size(conceptChecks)-1 || 0}))
    );
  }


  // ###################################################
  // User actions
  // ###################################################

  updateUserPrefs(prefs){
    const { userInfoRef } = this.context;
    if (!userInfoRef) {
      console.error(new Error("tried to update prefs before login"));
      return;
    }
    return this.wrapPromise(userInfoRef.update_prefs(prefs));
  }

  updateCheckResponse(conceptId, checkId, checkStillExists, response) {
    const { 
      conceptCheckResponsesRef,
      notificationsRef
    } = this.props;

    return this.wrapPromise(
      conceptCheckResponsesRef.updateResponse(
        conceptId, checkId, checkStillExists, response)
      .then(() => {
        return notificationsRef.addNotification('checkResponse', response.name, {
          conceptId,
          checkId,
          status: conceptCheckResponsesRef.isActive(conceptId, checkId, response)
        });
      })
    );
  }

  updateConceptResponse({conceptId, conceptResponse}) {
    const { 
      conceptResponsesRef,
      notificationsRef
    } = this.props;

    return this.wrapPromise(
      conceptResponsesRef.updateTextResponse(conceptId, conceptResponse)
      .then(() => {
        if (conceptResponse.hasSubmitted) {
          return notificationsRef.addNotification('conceptResponse', null, {
            conceptId,
            text: conceptResponse.text,
            hasSubmitted: conceptResponse.hasSubmitted
          });
        }
        else {
          // TODO: add log entry
        }
      })
    );
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
    if (this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (!this.areParamsValid) {
      return (<Alert bsStyle="danger">
        invalid concept
        <Button onClick={this.gotoRoot}>go home</Button>
      </Alert>);
    }

    let toolsEl, conceptEditorEl;
    if (this.mayEdit) {
      const currentConceptEditTools = !this.currentConcept ? null :
        (<ConceptEditTools {...{ 
          ownerId: this.currentOwnerId,
          parentId: this.currentParentId,
          conceptId: this.currentConceptId,
          concept: this.currentConcept,
          toggleConceptPublic: this.toggleConceptPublic,
          deleteConcept: this.deleteConcept,
          editing: this.isEditMode,
          toggleEdit: this.toggleEdit
        }} />);

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
            busy: this.isBusy, 
            addConcept: this.addConcept
          }} />
        );
      }
      else if (this.isEditMode) {
        conceptEditorEl = (
          <ConceptEditor {...{
            busy: this.isBusy,
            onSubmit: this.updateConcept,
            conceptId: this.currentConceptId,
            concept: this.currentConcept,
            conceptChecks: this.currentConceptChecks,
            addConceptCheck: this.addConceptCheck,
            deleteConceptCheck: this.deleteConceptCheck
          }} />
        );
      }
    }

    const errEl = this.state.error && (
      <Alert bsStyle="danger"><pre>
        {this.state.error.message || this.state.error}
      </pre></Alert>
    );

    const childConcepts = this.currentChildConcepts;
    const conceptProgress = this.computeCurrentConceptProgress();

    const childConceptsEl = (!childConcepts || _.isEmpty(childConcepts)) ? null : (
      // display childConcepts
      <ConceptGrid {...{
        busy: this.state.busy,
        ownerId: this.currentOwnerId,
        parentId: this.currentConceptId,
        concepts: childConcepts,
        mayEdit: this.mayEdit,
        conceptProgress,

        toggleConceptPublic: this.toggleConceptPublic,
        deleteConcept: this.deleteConcept,
        updateConcept: this.updateConcept
      }} />
    );

    // render!
    return (
      <div>
        <h3>
          <div>
            <ConceptBreadcrumbs 
              ownerConcepts={this.currentLoadedConcepts} 
              currentConceptId={this.currentConceptId} />

            { toolsEl || <p style={{display: 'inline-block'}}>&nbsp;</p> }
            { this.currentConcept && <ConceptPlayViewControls {...{
              userPrefs: this.userPrefs,
              updateUserPrefs: this.updateUserPrefs
            }} /> }
          </div>
        </h3>
        { errEl }
        { conceptEditorEl }
        { this.currentConcept && <ConceptPlayView 
          {...{
            userPrefs: this.userPrefs,
            conceptId: this.currentConceptId,
            concept: this.currentConcept,
            conceptResponse: this.currentConceptResponse,
            conceptChecks: this.currentConceptChecks,
            conceptCheckResponses: this.currentCheckResponses,
            conceptCheckResponseDetails: this.currentCheckResponseDetails,
            conceptProgress,

            updateConceptResponse: this.updateConceptResponse,
            updateCheckResponse: this.updateCheckResponse
          }} /> }
        { childConceptsEl }
      </div>
    );
  }
} 