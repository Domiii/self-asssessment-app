import { createReducer } from 'redux-act';
import * from './actions';


/**
 * The payload object corresponds to a firebase.User object:
 * https://firebase.google.com/docs/reference/node/firebase.User
 */

const doMerge = (state, payload) => state.merge({
  // ...: ...
});

export default createReducer({
  
  [signInSuccess]: doMerge,

  [signOutSuccess]: () => return new User();
}, new User());
