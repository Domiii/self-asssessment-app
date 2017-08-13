import { makeRefWrapper } from 'src/firebaseUtil';
import { lookupLocalized } from 'src/util/localizeUtil';

// access to the current user's info
const UserInfoRef = makeRefWrapper({
  pathTemplate: '/users',

  children: {
    user: {
      groupBy: ['uid'],

      methods: {
        get uid() {
          return this.props && this.props.uid;
        },

        isLoggedIn() {
          return !!this.props && !!this.props.uid;
        },

        isAdmin() {
          return this.role() >= 5;
        },

        isAdminDisplayMode() {
          return this.displayRole() >= 5;
        }

        getLocalized(obj, entry) {
          return lookupLocalized(this.locale(), obj, entry);
        },

        setUserData(userData) {
          return this.set_data(userData);
        },

        ensureUserInitialized() {
          const { auth } = this.props;

          if (this.isLoggedIn() && this.isLoaded && !this.data()) {
            // user logged in and but no record of user data
            // -> get user data and add to userInfo DB
            // see: https://firebase.google.com/docs/reference/js/firebase.UserInfo
            let userData = auth.providerData && auth.providerData.length && 
              auth.providerData[0];
            if (!userData) {
              userData = {
                displayName: auth.displayName || 'unknown',
                email: auth.email
              };
            }
            console.log("Writing user data: " + JSON.stringify(userData));
            return this.setUserData(userData);
          }
        },

        updateUser(userFormData) {
          if (this.isAdmin()) {
            // admins can override other stuff as well
            delete userFormData.public.role;
            return this.update(userFormData);
          }
          else {
            // normal users can only set their personal data
            return this.setUserData(userFormData.data);
          }
        }
      },

      children: {
        public: {
          pathTemplate: 'public/$(uid)',

          children: {
            role: 'role',
            displayName: 'displayName',
            photoURL: 'photoURL'
          }
        },

        private: {
          pathTemplate: 'private/$(uid)',

          children: {
            displayRole: 'displayRole',

            data: 'data',   // personal user data (we copy this from firebase auth on first use)
            email: 'data/email',
            locale: 'data/locale',

            // TODO: Put this into a different path. Personal user settings don't belong with account data.
            prefs: {    // some UI user preferences
              pathTemplate: 'prefs',
              children: {
                conceptPlayViewWideScreen: 'conceptPlayViewWideScreen'
              }
            }
          }
        }
      }
    }
  }
});

export default UserInfoRef;