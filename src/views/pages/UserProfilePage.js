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

import _ from 'lodash';

class _UserForm extends Component {
  static contextTypes = {
    userInfo: PropTypes.object.isRequired
  };


  render() {
    const { userInfo } = this.context;
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const isAdmin = userInfo && userInfo.isAdmin();

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        {(isAdmin && <FormInputField name="adminDisplayMode" label="admin view"
          inputProps={{
            type: 'checkbox',
            component: 'input'
          }}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />)}
        <FormInputField name="data.userName" label="user name"
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
    userInfo: PropTypes.object.isRequired
  };

  render() {
    // data
    const { userInfo } = this.context;
    const isAdmin = userInfo && userInfo.isAdmin();
    const isBusy = userInfo && !userInfo.isLoaded;

    // actions
    const updateUser = (userFormData) => {
      if (isAdmin) {
        // admins can override other stuff as well
        userInfo.update(userFormData);
      }
      else {
        // normal users can only set their personal data
        userInfo.set_data(userFormData.data);
      }
    };


    // go render!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    return (
      <UserForm onSubmit={updateUser} initialValues={userInfo.val} />
    );
  }
}