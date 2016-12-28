import { combineReducers } from 'redux';

import { routerReducer as routing } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'redux-react-firebase';
import { authReducer as auth } from './auth';
import { reducer as reduxForm } from 'redux-form';

export default combineReducers({
  routing,
  firebase,
  form: reduxForm,
  auth
});
