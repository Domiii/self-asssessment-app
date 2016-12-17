import { createReducer } from 'redux-act';
import * from './actions';
import * from './User';


/**
 * The payload object corresponds to a firebase.User object:
 * https://firebase.google.com/docs/reference/node/firebase.User
 */

const doMerge = (state, payload) => state.merge({
  authenticated: !!payload && payload.emailVerified,
  uid: payload ? payload.uid : null,
  displayName: payload ? payload.displayName : null,
  email: payload ? payload.email : null
});

export default createReducer({
  [initAuth]: doMerge,
  [signInSuccess]: doMerge,

  [signOutSuccess]: () => return new User();
}, new User());
