import { 
  ConceptsRef,
  ConceptChecksRef,
  ConceptResponsesRef,
  ConceptCheckResponsesRef,
  ConceptCheckResponseDetailsRef,

  computeAllChecksProgress
} from 'src/core/concepts/';

import autoBind from 'react-autobind';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Firebase, { Promise } from 'firebase';
import { firebaseConnect } from 'react-redux-firebase';
import _ from 'lodash';

@firebaseConnect((props, firebase) => {
  const { params } = props;
  const conceptId = params.conceptId;

  // TODO: There are better ways to get the current uid
  const uid = Firebase._.authUid;

  const queries = [
    ConceptsRef.makeQuery(params.ownerId)
  ];

  if (params.conceptId) {
    queries.push(ConceptChecksRef.ofConcept.makeQuery({conceptId}));
    queries.push(ConceptCheckResponsesRef.makeQuery({uid}));
    queries.push(ConceptCheckResponseDetailsRef.makeQuery({uid, conceptId}));
  }

  return queries;
})
@connect(
    ({ firebase }, props) => {
      const { params } = props;
      const uid = Firebase._.authUid;
      const conceptId = params.conceptId;

      let refs = {
        conceptsRef: ConceptsRef(firebase)
      };

      if (conceptId) {
        const checkArgs = { conceptId: conceptId || 0 };
        const responsesRefArgs = { uid };
        const responseDetailsArgs = {uid, conceptId};

        refs = Object.assign(refs, {
          conceptChecksRef: ConceptChecksRef.ofConcept(firebase, checkArgs),
          conceptCheckResponsesRef: ConceptCheckResponsesRef(firebase, responsesRefArgs),
          conceptCheckResponseDetailsRef: ConceptCheckResponseDetailsRef(firebase, responseDetailsArgs)
        });
      }
      return refs;
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
    conceptChecksRef: PropTypes.object,
    conceptCheckResponsesRef: PropTypes.object,
    conceptCheckResponseDetailsRef: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    this.state = {
      busy: false
    };

    autoBind(this);
  }
}