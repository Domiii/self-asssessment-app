import { UserInfo } from 'src/core/users';

import React, { Component, PropTypes } from 'react';
//import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import { 
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { LoadOverlay } from 'src/views/components/overlays';

import _ from 'lodash';

//TODO: Fix this!

class _UserForm extends Component {
  static contextTypes = {
    currentUserRef: PropTypes.object
  };

  render() {
    const { currentUserRef } = this.context;
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const isAdmin = currentUserRef && currentUserRef.isAdmin();

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <FormInputField name="displayName" label="display name"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="data.photoURL" label="photo URL"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        {(isAdmin && <FormInputField name="data.displayRole" label="display role"
          inputProps={{component:'select'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        >
          <option value="1">Student</option>
          <option value="5">Admin</option>
        </FormInputField>)}
        <FormInputField name="data.email" label="email"
          inputProps={{type: 'email', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="private.locale" label="language"
          inputProps={{component:'select'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </FormInputField>

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

export const UserForm = reduxForm({ form: 'user_info', enableReinitialize: true })(_UserForm);

export default class UserProfilePage extends Component {
  static contextTypes = {
    currentUserRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  updateUser(...args) {
    // TODO: Fix the update function
    const { currentUserRef } = this.context;
    //return currentUserRef && currentUserRef.updateUser(...args);
  }

  render() {
    // data
    const { currentUserRef } = this.context;
    const isBusy = currentUserRef && !currentUserRef.isLoaded || false;

    // go render!
    if (isBusy) {
      // still loading
      return (<LoadOverlay />);
    }

    // TODO: fix val getter
    const userInfo = currentUserRef && currentUserRef.val;
    return (
      <UserForm onSubmit={this.updateUser} initialValues={userInfo} />
    );
  }
}