import { UserInfo } from 'src/core/users';

import React, { Component, PropTypes } from 'react';
//import { connect } from 'react-redux';
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

class _UserForm extends Component {
  static contextTypes = {
    userInfoRef: PropTypes.object
  };


  render() {
    const { userInfoRef } = this.context;
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const isAdmin = userInfoRef && userInfoRef.isAdmin();

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        {(isAdmin && <FormInputField name="adminDisplayMode" label="admin view"
          component="input"
          inputProps={{
            type: 'checkbox',
            className: 'no-box-shadow'
          }}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />)}
        <FormInputField name="data.displayName" label="display name"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="data.email" label="email"
          inputProps={{type: 'email', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="data.locale" label="language"
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
    userInfoRef: PropTypes.object.isRequired
  };

  render() {
    // data
    const { userInfoRef } = this.context;
    const isBusy = userInfoRef && !userInfoRef.isLoaded || false;

    // actions
    const updateUser = userInfoRef && userInfoRef.updateUser.bind(userInfoRef);

    // go render!
    if (isBusy) {
      // still loading
      return (<LoadOverlay />);
    }

    const userInfo = userInfoRef && userInfoRef.val;
    return (
      <UserForm onSubmit={updateUser} initialValues={userInfo} />
    );
  }
}