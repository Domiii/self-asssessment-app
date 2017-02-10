import { 
  ConceptsRef,
  ConceptTreeRef,
  ConceptProgressRef,
  ConceptResponsesRef
} from 'src/core/concepts/';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase } from 'redux-react-firebase';
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { FAIcon } from 'src/views/components/util';

import {
  ConceptGrid
} from 'src/views/components/concept';

import {
  ConceptEditTools,
  AddConceptEditor
} from 'src/views/components/concept-editor';

import _ from 'lodash';


@firebase((props, firebase) => {
  const { params } = props;

  return [
    ConceptsRef.makeQuery(params.ownerId),
    //ConceptTreeRef.makeQuery(),
    ConceptResponsesRef.makeQuery(),
    ConceptProgressRef.makeQuery()
  ];
})
@connect(
  ({ firebase }) => {
    return {
      conceptsRef: ConceptsRef(firebase),
      //conceptTreeRef: ConceptTreeRef(firebase)
    };
  }
)
export default class ConceptsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    conceptsRef: PropTypes.object.isRequired,
    //conceptTreeRef: PropTypes.object.isRequired
  }

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false,
      adding: false
    };
    this.toggleAdding = this.toggleAdding.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  setAdding(adding) {
    this.setState({ 
      adding: adding,
      editingConcept: false
    });
  }

  toggleAdding() {
    this.setState({ 
      adding: !this.state.adding,
      editingConcept: false
    });
  }

  toggleEdit() {
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
    // prepare data
    const { userInfo, router, lookupLocalized } = this.context;  
    const { conceptsRef, conceptTreeRef, params } = this.props;
    const mayEdit = userInfo && userInfo.adminDisplayMode() || false;
    const notLoadedYet = !conceptsRef.isLoaded;
    const busy = this.state.busy;
    let { ownerId, conceptId } = params;

    const isRoot = !ownerId && !conceptId;
    ownerId = !isRoot && ownerId || null;
    conceptId = !isRoot && conceptId || null;

    const ownerConcept = !isRoot && conceptsRef.concept(ownerId) || null;
    const currentConcept = !isRoot && conceptsRef.concept(conceptId) || null;
    const parentId = !isRoot && currentConcept && currentConcept.parentId || null;

    const ownerConcepts = conceptsRef.val;
    const childConcepts = isRoot && 
      ownerConcepts ||  // root concepts
      conceptsRef.getChildren(conceptId);

    // prepare actions
    const gotoRoot = router.replace.bind(router, '/');
    const addConcept = ({ concept }) => {
      // TODO: Use transaction to avoid race condition
      const lastConcept = childConcepts && _.maxBy(Object.values(childConcepts), 'num') || null;
      concept.num = (lastConcept && lastConcept.num || 0)  + 1;
      concept.parentId = isRoot ? null : conceptId;

      const newRef = conceptsRef.add_concept(concept);
      const newOwnerId = isRoot ? newRef.key : ownerId;
      newRef.update({ownerId: newOwnerId});
      return this.wrapPromise(newRef)
        .then(() => this.setAdding(false));
    };
    const updateConcept = ({ conceptId, concept }) => {
      return this.wrapPromise(conceptsRef.update_concept(conceptId, concept));
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

    // go render!
    if (notLoadedYet) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (conceptId && !currentConcept) {
      //setTimeout(() => router.replace('/'), 3000);
      return (<Alert bsStyle="danger">invalid conceptId <Button onClick={gotoRoot}>go back</Button></Alert>);
    }

    const title = currentConcept &&
      lookupLocalized(currentConcept, 'title') ||
      'all concepts';

    // elements
    let tools, topEditors;
    if (mayEdit) {
      const conceptArgs = { ownerId, parentId, conceptId, concept: currentConcept };

      let editTools;
      if (!isRoot) {
        editTools = (<ConceptEditTools
          {...conceptArgs}
          {...{ 
            deleteConcept,
            editing: this.state.editingConcept,
            toggleEdit: this.toggleEdit }} />);
      }

      tools = (<span>
        {editTools}
        <Button active={this.state.adding} 
          bsStyle="success" bsSize="small" onClick={this.toggleAdding}>
          <FAIcon name="plus" className="color-green" /> add new concept
        </Button>
      </span>);

      if (this.state.adding) {
        topEditors = (
          <AddConceptEditor busy={busy} addConcept={addConcept}>
          </AddConceptEditor>
        );
      }
      if (this.state.editingConcept) {
        topEditors = (
          <ConceptEditor busy={busy} onSubmit={updateConcept} {...conceptArgs}></ConceptEditor>
        );
      }
    }

    const childConceptsEl = (!childConcepts || _.isEmpty(childConcepts)) ? (
      // no childConcepts
      <Alert bsStyle="info">concept has no children</Alert>
    ) : (
      // display childConcepts
      <div><ConceptGrid {...{
        busy, ownerId, parentId: conceptId, concepts: childConcepts, mayEdit, updateConcept, deleteConcept
      }} /></div>
    );

    //console.log(childConcepts && _.map(childConcepts, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{title} {tools}</h3>
        { topEditors }
        { errEl }
        { childConceptsEl }
      </div>
    );
  }
} 