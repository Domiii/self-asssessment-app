// TODO: Add more verbose rules
//    see: https://firebase.google.com/docs/database/security/securing-data

import { RefWrapper } from 'src/util/firebaseUtil';


export default class UserPriv extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/userPriv'; }

  constructor(getData, db) {
    super(UserPriv.PATH_ROOT, getData, db);
  }
}