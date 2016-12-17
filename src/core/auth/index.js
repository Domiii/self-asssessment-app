import { firebaseAuth } from 'src/core/firebase';
import * as authActions from './actions';


export { authActions };
export { authReducer } from './reducer';
export { getAuth, isAuthenticated } from './selectors';


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
