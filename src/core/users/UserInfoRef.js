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
        },

        setUserData(userData) {
          this.set_data(userData);
        },

        updateUser(userFormData) {
          if (this.isAdmin()) {
            // admins can override other stuff as well
            delete userFormData.isAdmin;
            this.update(userFormData);
          }
          else {
            // normal users can only set their personal data
            this.setUserData(userFormData.data);
          }
        }
      },

      children: {
        isAdmin: 'isAdmin', 
        adminDisplayMode: 'adminDisplayMode',

        data: 'data',   // personal user data (we copy this from firebase auth on first use)
        displayName: 'data/displayName',
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