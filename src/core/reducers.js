import { combineReducers } from 'redux';
import { routerReducer as 'routing' } from 'react-router-redux';
import { reduxReactFirebase, firebaseStateReducer as firebase } from 'redux-react-firebase';

import auth from './auth/reducer';


export default combineReducers({
  routing,
  auth,
  firebase
});
