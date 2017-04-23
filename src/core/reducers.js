import { combineReducers } from 'redux';

import { routerReducer as routing } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'redux-react-firebase';
import { reducer as form } from 'redux-form';
import { reducer as app } from './app';

export default combineReducers({
  routing,
  firebase,
  form,
  app
});
