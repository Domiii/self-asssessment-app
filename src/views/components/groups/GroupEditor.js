import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import Moment from 'react-moment';
import {
  Alert, Badge, ListGroup, ListGroupItem,
  Grid, Row, Col
} from 'react-bootstrap';

import { Flex, Item } from 'react-flex';

import ConfirmModal from 'src/views/components/util/ConfirmModal';
import UserList from 'src/views/components/users/UserList';

import { 
  Field, reduxForm, FormSection, FieldArray
} from 'redux-form';


class _GroupInfoForm extends Component {
  static contextTypes = {
    currentUserRef: PropTypes.object
  };

  render() {
    const { currentUserRef } = this.context;
    const { 
      handleSubmit,
      pristine, 
      reset, 
      submitting 
    } = this.props;
    const isAdmin = currentUserRef && currentUserRef.isAdmin();

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <FormInputField name="title_en" label="Title (English)"
          type="text" component="input"
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="title_zh" label="Title (中文)"
          type="text" component="input"
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="description_en" label="Description (English)"
          component="textarea"
          inputProps={{rows: '15'}}
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="description_zh" label="Description (中文)"
          component="textarea"
          inputProps={{rows: '15'}}
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />

        <div>
          <Button type="submit" disabled={pristine || submitting}>
            {<span><FAIcon name="upload" className="color-green" /> save</span>}
          </Button>
          <Button disabled={pristine || submitting} onClick={reset}>reset</Button>
        </div>
      </form>
    );
  }
}

_GroupInfoForm = reduxForm({ enableReinitialize: true })(_GroupInfoForm);

export const GroupInfoForm = connect(
  (state, { group, groupId }) => {
    return ({
      form: 'group_' + groupId,
      initialValues: {
        group,
        groupId
      },
    });
  }
)(_GroupInfoForm);

function DeleteUserButton({open}) {
  return (<Button onClick={open} className="color-red" bsSize="small">
    <FAIcon name="trash" />
  </Button>);
}
function makeExistingUserEl(deleteUserFromGroup) {
  return ({user, uid}) => (<Badge>
    <span>{user.displayName}</span>

    <ConfirmModal
      header="Delete user from group?"
      body={(<span>{user.displayName}</span>)}
      buttonFn={DeleteUserButton}
      onConfirm={() => deleteUserFromGroup(uid)}
    />
  </Badge>);
}


function AddUserButton({open}) {
  return (<Button onClick={open} className="color-green" bsSize="small">
    <FAIcon name="plus" />
  </Button>);
}
function makeAddUserEl(addUserToGroup) {
  return ({user, uid}) => (<Badge>
    <span>{user.displayName}</span>

    <ConfirmModal
      header="Add user to group?"
      body={(<span>{user.displayName}</span>)}
      buttonFn={AddUserButton}
      onConfirm={() => addUserToGroup(uid)}
    />
  </Badge>);
}

export function GroupUserEditor({
  existingUsers,
  addableUsers,

  deleteUserFromGroup,
  addUserToGroup
}) {
  return (<Flex row={true} alignItems="start">
    <Item>
      <UserList users={existingUsers} 
          renderUser={makeExistingUserEl(deleteUserFromGroup)} />
    </Item>
    <Item>
      <UserList users={addableUsers} 
          renderUser={makeAddUserEl(addUserToGroup)} />
    </Item>
  </Flex>);
}


export function AddUserEl({user, uid}) {
  return (<span>
    <span>{user.displayName}</span>

    <ConfirmModal
      data={{user, uid}}
      header="Add user to group?"
      body={(<span>{user.displayName}</span>)}
      buttonFn={this.deleteUserEl}
      onConfirm={this.onUserDeleted}
    />
  </span>);
}



export default class GroupEditor extends Component {
  static propTypes = {
    groupId: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    existingUsers: PropTypes.object.isRequired,
    addableUsers: PropTypes.object.isRequired,

    updateGroup: PropTypes.func.isRequired,
    addUserToGroup: PropTypes.func.isRequired,
    deleteUserFromGroup: PropTypes.func.isRequired
  };

  constructor() {
    super();

    autoBind(this);
  }


  addUserToGroup(uid) {
    const {
      groupId,
      addUserToGroup
    } = this.props;

    return addUserToGroup({
      user: uid,
      group: groupId
    });
  }

  deleteUserFromGroup(uid) {
    const {
      groupId,
      deleteUserFromGroup
    } = this.props;

    return deleteUserFromGroup({
      user: uid,
      group: groupId
    });
  }

  render() {
    const {
      groupId,
      group,
      existingUsers,
      addableUsers,

      updateGroup
    } = this.props;



    return (
      <div>
        <GroupInfoForm 
          onSubmit={ updateGroup }
          initialValues={ group, groupId } />

        <Moment fromNow>{ group.updatedAt }</Moment>

        <GroupUserEditor {...{
          existingUsers,
          addableUsers,

          addUserToGroup: this.addUserToGroup,
          deleteUserFromGroup: this.deleteUserFromGroup
        }} />
      </div>
    );
  }
}