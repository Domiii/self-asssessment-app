import { Record } from 'immutable';
import { INIT_AUTH, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS } from './action-types';


export const User = new Record({
  authenticated: false,
  uid: null,
  displayName: null,
  email: null
});


/**
 * @see https://firebase.google.com/docs/reference/node/firebase.User
 * @param {object} state
 * @returns {object}
 */
export function authReducer(state = new User(), {payload, type}) {
  switch (type) {
    case INIT_AUTH:
    case SIGN_IN_SUCCESS:
      return state.merge({
        authenticated: !!payload && payload.emailVerified,
        uid: payload ? payload.uid : null,
        displayName: payload ? payload.displayName : null,
        email: payload ? payload.email : null
      });

    case SIGN_OUT_SUCCESS:
      return new User();

    default:
      return state;
  }
}
