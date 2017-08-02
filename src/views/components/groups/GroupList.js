import React, { Component, PropTypes } from 'react';
import GroupView from './GroupView';
import {
  ListGroup, ListGroupItem
} from 'react-bootstrap';

@connect(({ firebase }, props) => {
  return {
    userInfoRef: UserInfoRef(firebase),
    groupsRef: GroupsRef(firebase)
  };
})
export default class GroupList extends Component {
  static propTypes = {
    groups: PropTypes.object.isRequired
  };

  render() {
    const { 
      groups,

      userInfoRef,
      groupsRef
    } = this.props;

    const list = _.sortBy(groups, group => -group.updatedAt);

    const groupEls = _.map(list, (group, id) => 
      <GroupView key={id + ''} {...{group}} />
    );

    return (
      <ListGroup>
        {groupEls}
      </ListGroup>
    );
  }
}