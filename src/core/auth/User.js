import { Record } from 'immutable';

export const User = new Record({
  authenticated: false,
  uid: null,
  displayName: null,
  email: null
});