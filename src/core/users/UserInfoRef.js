import { refWrapper } from 'src/util/firebaseUtil';
import { lookupLocalized } from 'src/util/localizeUtil';

// access to the current user's info
const UserInfoRef = refWrapper({
  pathTemplate: '/users',

  children: {
    user: {
      pathTemplate: '$(uid)',
      methods: {
        getLocalized(obj, entry) {
          return lookupLocalized(this.locale(), obj, entry);
        }
      },
      children: {
        isAdmin: 'isAdmin', 
        adminDisplayMode: 'adminDisplayMode',

        data: 'data',   // personal user data (we currently copy this from their Google account)
        userName: 'data/userName',
        email: 'data/email',
        locale: 'data/locale',

        prefs: {    // some UI user preferences
          pathTemplate: 'prefs',
          children: {
            conceptPlayViewWideScreen: 'conceptPlayViewWideScreen'
          }
        }
      }
    }
  }
});

export default UserInfoRef;