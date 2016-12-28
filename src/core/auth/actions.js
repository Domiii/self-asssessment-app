import firebase from 'firebase';
import { firebaseAuth } from 'src/core/firebase';
import { actionCreator } from 'src/util/actionUtil';

const createAction = actionCreator('AUTH_');


export const initAuth = createAction('initAuth');
export const signInSuccess = createAction('signInSuccess', () => result.user);
export const signInError = createAction('signInError');
export const signOutSuccess = createAction('signOutSuccess');



function authenticate(provider) {
  return dispatch => {
    firebaseAuth.signInWithRedirect(provider)
      .then(result => dispatch(signInSuccess(result)))
      .catch(error => dispatch(signInError(error)));
  };
}

export function signInWithGithub() {
  return authenticate(new firebase.auth.GithubAuthProvider());
}


export function signInWithGoogle() {
  return authenticate(new firebase.auth.GoogleAuthProvider());
}


export function signInWithTwitter() {
  return authenticate(new firebase.auth.TwitterAuthProvider());
}

export function signOut() {
  return dispatch => {
    firebaseAuth.signOut()
      .then(() => dispatch(signOutSuccess()));
  };
}