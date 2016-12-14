import { Record } from 'immutable';

// TODO: Add more verbose rules
//    see: https://firebase.google.com/docs/database/security/securing-data


export const User = new Record({
  uid: null,
  displayName: null,
  isAdmin: false
});
