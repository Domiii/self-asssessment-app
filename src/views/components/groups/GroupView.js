import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import Moment from 'react-moment';
import {
  Alert, Badge, ListGroup, ListGroupItem
} from 'react-bootstrap';

import ConfirmModal from 'src/views/components/util/ConfirmModal';
import UserList from 'src/views/components/users/UserList';

@connect({({ firebase }, props) => {
  const groupsRef = GroupsRef(firebase);
  return {
    // userInfoRef: UserInfoRef(firebase),
    // groupsRef,
    
    addUserToGroup: groupsRef.addUserToGroup,
    removeUserFromGroup: groupsRef.removeUserFromGroup
  };
})
export default class GroupView extends Component {
  static propTypes = {
    group: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,

    addUserToGroup: PropTypes.func.isRequired,
    removeUserFromGroup: PropTypes.func.isRequired
  };

  constructor() {
    super();

    autoBind(this);
  }

  get EmptyEl() {
    return (
      <Alert bsStyle="warning">
        <span>group is empty</span>
      </Alert>
    );
  }

  removeUserEl(open) {
    return (<Button onClick={open} className="color-red" bsSize="small">
      <FAIcon name="trash" />
    </Button>);
  }

  userEl(user, uid) {
    return (<span>
      <span>user.displayName</span>

      <ConfirmModal
        header="Remove user from group?"
        body={(<span>{user.displayName}</span>)}
        buttonFn={this.removeUserEl}
        onConfirm={() => console.log('delete user ' + user.displayName);}
      />
    </span>);
  }

  render() {
    const {
      group: {
        title,
        updatedAt
      },
      users
    } = this.props;

    const userEls = isEmpty(users) ? 
      this.EmptyEl : 
      (<UserList users={users} 
          renderUser={this.userEl} />);

    return (
      <li className="list-group-item">
        <h4 className="list-group-item-heading">
          {`${title}`}
        </h4>
        <Moment fromNow>{updatedAt}</Moment>
        { userEls }
      </li>
    );
  }
}