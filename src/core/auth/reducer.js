import { createReducer } from 'redux-act';
import * as actions from './actions';
import CurrentUser from './CurrentUser';


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
  [actions.initAuth]: doMerge,
  [actions.signInSuccess]: doMerge,

  [actions.signOutSuccess]: () => new CurrentUser()
}, new CurrentUser());
