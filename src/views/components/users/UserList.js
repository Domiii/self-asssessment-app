import map from 'lodash/map';
import {
  Badge
} from 'react-bootstrap';

import React, { Component, PropTypes } from 'react';


export default class UserList extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired,
    renderUser: PropTypes.element.isRequired
  };

  renderUser(user) {
    return user.displayName;
  }

  render() {
    let {
      users,
      renderUser
    } = this.props;

    renderUser = renderUser || this.renderUser;

    return (
      return map(users, (user, uid) => (
        <Badge key={user.displayName}>
          { this.renderUser(user, uid) }
        </Badge>
      ));
    );
  }
}