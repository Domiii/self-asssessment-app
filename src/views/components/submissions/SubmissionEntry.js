import React, { Component, PropTypes } from 'react';
import Moment from 'react-moment';
import {
  ListGroup, ListGroupItem, Well
} from 'react-bootstrap';
import { Link } from 'react-router';
import { FAIcon } from 'src/views/components/util';

import { hrefConceptView } from 'src/views/href';

export default class SubmissionEntry extends Component {
  static propTypes = {
    submission: PropTypes.object.isRequired
  };
  
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

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
    const name = user && user.data && user.data.displayName || '<unknown>';
    const email = user && user.data && user.data.email || '<unknown>';

    return (<span>
      {`${name} (${email})`}
    </span>);
  }

  render() {
    let { 
      submission: {
        uid,
        conceptId,
        text,
        hasSubmitted,
        updatedAt
      }
    } = this.props;

    // the weird names are due to `populate` not allowing aliasing the populated object's key
    // see: https://github.com/prescottprue/react-redux-firebase/issues/126
    const user = uid;
    uid = user.uid;

    const concept = conceptId;
    conceptId = conceptId.conceptId;

    const iconSize = '2em';
    const userIcon = user && user.data &&
      <img style={{maxWidth: iconSize}} src={user.data.photoURL} /> || 
      <FAIcon style={{fontSize: iconSize}} name="user" />;

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
            { userIcon } <span className="margin-half" />
            Submission for{ this.makeConceptEl(conceptId, concept) }
            by { this.makeUserEl(uid, user) }
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