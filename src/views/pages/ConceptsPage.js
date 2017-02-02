import { UserInfoRef } from 'src/core/users';
import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { 
  ConceptsRef,
  ConceptProblemsRef,
  ConceptProgressRef,
  ProblemResponsesRef
} from 'src/core/concepts/';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase } from 'redux-react-firebase';
import { Alert, Button, Jumbotron, Well } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FAIcon } from 'src/views/components/util';

import ConceptInfoEditor from 'src/views/components/concept-editor/ConceptInfoEditor';

import _ from 'lodash';


export class ConceptListItem extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    concept: PropTypes.object.isRequired,
    conceptId: PropTypes.string.isRequired
  };

  render() {
    const { userInfo, lookupLocalized } = this.context;
    const { concept, conceptId } = this.props;
    const conceptViewPath = '/concept-view/' + conceptId;
    const conceptPlayPath = '/concept-play/' + conceptId;

    const title = lookupLocalized(concept, 'title') || '<no title>';

    return (
      <span>
        <Well className="no-margin">
          <div>
            <Link to={conceptViewPath} onlyActiveOnIndex={true}>
              <h3 className="no-margin">{title}</h3>
            </Link>
          </div>
          <Link to={conceptViewPath} onlyActiveOnIndex={true}>
            view
          </Link>
          <span className="margin-half" />
          <Link to={conceptPlayPath} onlyActiveOnIndex={true}>
            play
          </Link>
        </Well>
      </span>
    );
  }
}

export class ConceptList extends Component {
  static propTypes = {
    concepts: PropTypes.object.isRequired
  };

  render() {
    const { concepts } = this.props;

    return (
      <SimpleGrid objects={concepts} 
        nCols={4}
        colProps={{className: 'padding-half'}}
        objectComponentCreator={(key, value) => <ConceptListItem key={key} conceptId={key} concept={value} />}
      >
      </SimpleGrid>
    );
  }
}

class AddConceptEditor extends Component {
  static propTypes = {
    addConcept: PropTypes.func.isRequired
  }

  render() {
    const { addConcept } = this.props;

    return (
      <ConceptInfoEditor onSubmit={addConcept}></ConceptInfoEditor>
    );
  }
}


@firebase((props, firebase) => ([
  ConceptsRef.path,
  ConceptProblemsRef.path,
  ProblemResponsesRef.path,
  ConceptProgressRef.path
]))
@connect(
  ({ firebase }) => {
    return {
      conceptsRef: ConceptsRef(firebase),
      problemsRef: ConceptProblemsRef(firebase)
    };
  }
)
export default class ConceptsPage extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired
  };

  static propTypes = {
    conceptsRef: PropTypes.object.isRequired,
    problemsRef: PropTypes.object.isRequired
  };

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
    // prepare data + wrappers
    const { userInfo } = this.context;
    const { conceptsRef } = this.props;
    const mayEdit = userInfo && userInfo.adminDisplayMode();
    const isBusy = !conceptsRef.isLoaded;

    // prepare actions
    const addConcept = ({concept}) => {
      conceptsRef.add_concept(concept);
    };


    // go render!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    const adminTools = mayEdit && (<div>
      <AddConceptEditor addConcept={addConcept} />
      <hr />
    </div>);

    return (<div>
      {adminTools}
      <ConceptList concepts={conceptsRef.val || {}} />
    </div>);
  }
}