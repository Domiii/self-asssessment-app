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
    const { ownerId, conceptId } = params;

    const isRoot = !ownerId && !conceptId;
    const ownerConcept = !isRoot && conceptsRef.concept(ownerId);
    const currentConcept = !isRoot && conceptsRef.concept(conceptId);
    const parentConcept = !isRoot && currentConcept.parentId && conceptsRef.concept(currentConcept.parentId);

    const ownerConcepts = conceptsRef.val;
    const childConcepts = isRoot && 
      ownerConcepts ||  // root concepts
      (ownerConcepts && _.filter(ownerConcepts, {parentId: conceptId}));

    // prepare actions
    const gotoRoot = router.replace.bind(router, '/');
    const addConcept = ({ concept }) => {
      // TODO: Use transaction to avoid race condition
      const lastConcept = childConcepts && _.maxBy(Object.values(childConcepts), 'num') || null;
      concept.num = (lastConcept && lastConcept.num || 0)  + 1;
      concept.parentId = isRoot ? null : conceptId;

      const newRef = conceptsRef.add_concept(concept);
      const newOwnerId = isRoot ? newRef.name() : ownerId;
      newRef.update({ownerId: newOwnerId});
      return this.wrapPromise(newRef);
    };
    const updateConcept = ({ conceptId, concept }) => {
      return this.wrapPromise(conceptsRef.update_concept(conceptId, concept));
    };
    const deleteConcept = (conceptId) => {
      return this.wrapPromise(childConceptsRef.deleteConcept(conceptId));
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

    const parentTitle = parentConcept &&
      lookupLocalized(parentConcept, 'title') ||
      'all concepts';

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
          <FAIcon name="plus" className="color-green" /> add new concept
        </Button>
      </span>);
      if (this.state.adding) {
        topEditors = (
          undefined
          //<AddConceptEditor busy={busy} concept={parentConcept} addConcept={addConcept}>
          //</AddConceptEditor>
        );
      }
      if (this.state.editingConcept) {
        topEditors = (
          undefined
          //<ConceptInfoEditor ownerId={ownerId} concept={concept} onSubmit={updateConcept}></ConceptInfoEditor>
        );
      }
    }

    const childConceptsEl = !childConcepts ? (
      // no childConcepts
      <Alert bsStyle="info">concept has no children</Alert>
    ) : (
      // display childConcepts
      <div><ConceptGrid {...{
        busy, ownerId, concepts: childConcepts, mayEdit, updateConcept, deleteConcept
      }} /></div>
    );

    //console.log(childConcepts && _.map(childConcepts, p => p.description_en).join(', '));

    const errEl = !this.state.error ? undefined : (
      <Alert bsStyle="danger">{this.state.error.stack || this.state.error}</Alert>
    );

    return (
      <div>
        <h3>{parentTitle} {tools}</h3>
        { topEditors }
        { errEl }
        { childConceptsEl }
      </div>
    );
  }
}