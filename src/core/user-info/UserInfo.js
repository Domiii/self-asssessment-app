// TODO: Add more verbose rules
//    see: https://firebase.google.com/docs/database/security/securing-data

import { RefWrapper } from 'src/util/firebaseUtil';


export default class UserInfo extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/users'; }

  static userPath(uid) {
    return UserInfo.PATH_ROOT + '/' + uid;
  }

  constructor(auth, getData, db) {
    super(UserInfo.PATH_ROOT, getData, db);
    this._auth = auth;
  }

  getUserInfo(uid) {
    return this.getData(uid);
  }

  isAdmin(uid) {
    const user = this.getUserInfo(uid);
    return !!user && user.isAdmin;
  }

  isCurrentAdmin() {
    return !!this._auth && this.isAdmin(this._auth.uid);
  }
}