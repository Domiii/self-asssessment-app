import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import Moment from 'react-moment';
import {
  Alert, Badge, ListGroup, ListGroupItem,
  Well
} from 'react-bootstrap';


import GroupEditTools from './GroupEditTools';
import UserList from 'src/views/components/users/UserList';



export default class GroupView extends Component {
  static contextTypes = {
    currentUserRef: PropTypes.object,
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    group: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired
  };

  constructor() {
    super();

    this.state = {
      editing: null
    };

    autoBind(this);
  }

  get IsAdmin() {
    const { currentUserRef } = this.context;
    return currentUserRef && currentUserRef.isAdminDisplayMode() || false;
  }

  get EmptyEl() {
    return (
      <Alert bsStyle="warning">
        <span>group is empty</span>
      </Alert>
    );
  }

  get IsEditing() {
    return this.state.editing;
  }

  toggleEdit() {
    this.setState({
      editing: !this.IsEditing
    });
  }

  editorHeader() {
    const { 
      group
    } = this.props;

    return !this.IsAdmin ? null : (
      <div>
        <GroupEditTools {...{
          entryInfo: group.title,

          //changeOrder: 

          editing: this.IsEditing,
          toggleEdit: this.toggleEdit,

          deleteEntry: deleteGroup
        }}/>
      </div>
    );
  }

  render() {
    const {
      lookupLocalized
    } = this.context;

    const {
      group,
      users,
      groupEditor
    } = this.props;

    const userEls = isEmpty(users) ? 
      this.EmptyEl : 
      (<UserList users={users} />);

    return (<div>
      <li className="list-group-item">
        <h4 className="list-group-item-heading">
          { lookupLocalized(group, 'title') }
        </h4>
        <Well>
          { lookupLocalized(group, 'description') }
        </Well>
        <Moment fromNow>{group.updatedAt}</Moment>
        <div>
          { userEls }
        </div>
        { groupEditor }
      </li>
    </div>);
  }
}