import map from 'lodash/map';

import React, { Component, PropTypes } from 'react';
import {
  Badge
} from 'react-bootstrap';



class RenderUserDefault extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    uid: PropTypes.string.isRequired,
    childProps: PropTypes.any
  }

  render() {
    const {
      user,
      childProps
    } = this.props;

    return (<Badge {...childProps}>{user.displayName}</Badge>);
  }
}

export default class UserList extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired,
    renderUser: PropTypes.element
  };

  render() {
    let {
      users,
      renderUser
    } = this.props;

    //const RenderUser = renderUser || RenderUserDefault;
    const RenderUser = RenderUserDefault;
    console.log(users);

    return (<div>
      {map(users, (user, uid) => (
        !user ? null : <span key={uid}>
          { <RenderUser user={user} uid={uid} /> }
        </span>
      ))}
    </div>);
  }
}