import map from 'lodash/map';

import React, { Component, PropTypes } from 'react';
import {
  Badge
} from 'react-bootstrap';



function RenderUserDefault(user) {
  return (<Badge>user.displayName</Badge>);
}

export default class UserList extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired,
    renderUser: PropTypes.element.isRequired
  };

  render() {
    let {
      users,
      renderUser
    } = this.props;

    renderUser = renderUser || RenderUserDefault;

    return (
      return map(users, (user, uid) => (
        <span key={uid}>
          { <renderUser user={user} uid={uid} /> }
        </span>
      ));
    );
  }
}