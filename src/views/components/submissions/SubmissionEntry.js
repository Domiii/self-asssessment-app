import React, { PureComponent, PropTypes } from 'react';
import Moment from 'react-moment';
import {
  ListGroup, ListGroupItem, Well
} from 'react-bootstrap';
import { Link } from 'react-router';
import { FAIcon } from 'src/views/components/util';

import { hrefConceptView } from 'src/views/href';
import isEqual from 'lodash/isEqual';

export default class SubmissionEntry extends PureComponent {
  static propTypes = {
    submission: PropTypes.object.isRequired
  };
  
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props);
  }

  makeConceptEl(conceptId, concept) {
    const {
      lookupLocalized
    } = this.context;

    // TODO: Get conceptId
    return (
      <pre style={{display: 'inline', fontSize: '1.2em'}}
        className="margin-half no-padding">
        <Link className="margin"
          to={hrefConceptView(concept.ownerId, conceptId)}>
          {lookupLocalized(concept, 'title')}
        </Link>
      </pre>
    );
  }

  makeUserEl(uid, user) {
    const iconSize = '2em';

    const name = user && user.data && user.data.displayName || '<unknown>';
    const email = user && user.data && user.data.email || '<unknown>';
    const userIcon = user && user.data &&
      <img style={{maxWidth: iconSize}} src={user.data.photoURL} /> || 
      <FAIcon style={{fontSize: iconSize}} name="user" />;

    return (<span className="submission-user">
      <span className="submission-user-icon">{ userIcon }</span
      > <span className="submission-user-name">{ name }</span
      > <span className="submission-user-email">({ email })</span>
    </span>);
  }

  render() {
    let { 
      submissionId,
      submission: {
        uid,
        conceptId,
        text,
        hasSubmitted,
        updatedAt
      }
    } = this.props;

    // renderCalls[submissionId] = renderCalls[submissionId] ? (renderCalls[submissionId] + 1) : 1;

    // the weird names are due to `populate` not allowing aliasing the populated object's key
    // see: https://github.com/prescottprue/react-redux-firebase/issues/126
    const user = uid;
    uid = user.uid;

    const concept = conceptId;
    conceptId = conceptId.conceptId;

    return (
      <li className="list-group-item">
        <h4 className="list-group-item-heading">
          <div style={{float: 'right'}}>
            { hasSubmitted &&
              <FAIcon name="check" className="color-green" /> ||  
              <FAIcon name="remove" className="color-red" />
            }
          </div>
          <span>
            { this.makeUserEl(uid, user) } submitted{ this.makeConceptEl(conceptId, concept) }
          </span>
        </h4>
        <Moment fromNow>{updatedAt}</Moment> (<Moment format="ddd, MMMM Do YYYY, h:mm:ss a">{updatedAt}</Moment>)
        <pre className="list-group-item-text">
          { text }
        </pre>
      </li>
    );
  }
}