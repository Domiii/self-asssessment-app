import { UserInfo } from 'src/core/user-info';

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
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <FormInputField name="userName" label="user name"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="email" label="email"
          inputProps={{type: 'email', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="locale" label="language"
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
    userInfo: PropTypes.instanceOf(UserInfo).isRequired
  };

  render() {
    // data
    const { userInfo } = this.context;
    const isAdmin = userInfo && userInfo.isCurrentAdmin();
    const isBusy = !userInfo.isLoaded;


    // actions
    const updateUser = userInfo.updateCurrentUserInfo.bind(userInfo);


    // go render!
    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }

    return (
      <UserForm onSubmit={updateUser} initialValues={userInfo.rootData} />
    );
  }
}