import { refWrapper } from 'src/util/firebaseUtil';
import { lookupLocalized } from 'src/util/localizeUtil';

// access to the current user's info
const UserInfoRef = refWrapper({
  path: '/users',

  children: {
    user: {
      path: '$(uid)',
      methods: {
        getLocalized(obj, entry) {
          return lookupLocalized(this.locale(), obj, entry);
        }
      },
      children: {
        isAdmin: 'isAdmin', 
        adminDisplayMode: 'adminDisplayMode',
        userName: 'data/userName',
        email: 'data/email',
        locale: 'data/locale'
      }
    }
  }
});

export default UserInfoRef;