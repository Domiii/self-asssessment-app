import { FirebaseList } from 'src/core/firebase';
import * as userActions from './actions';
import { User } from './user';


export const userList = new FirebaseList({
  onAdd: userActions.createUserSuccess,
  onChange: userActions.updateUserSuccess,
  onLoad: userActions.loadUsersSuccess,
  onRemove: userActions.deleteUserSuccess
}, User);
