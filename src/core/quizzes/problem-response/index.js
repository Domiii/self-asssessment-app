import {firebase, firebaseDb} from 'firebase';


export function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    // see: https://firebase.google.com/docs/reference/node/firebase.auth.Auth#onAuthStateChanged
    const unsub = firebaseAuth.onAuthStateChanged(
      user => {
        dispatch(authActions.initAuth(user));
        unsub();
        resolve();
      },
      error => reject(error)
    );
  });
}