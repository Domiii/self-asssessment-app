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
        },

        getLocalized(obj, entry) {
          return lookupLocalized(this.locale(), obj, entry);
        },

        setAdminDisplayMode(enabled) {
          return this.set_displayRole(enabled ? 5 : 1);
        },

        setUserData(userData) {
          const updates = [];

          if (!this.data()) {
            updates.push(this.set_data(userData));
          }

          if (userData.photoURL) {
            updates.push(this.set_photoURL(userData.photoURL));
          }

          if (userData.displayName) {
            updates.push(this.set_displayName(userData.displayName));
          }

          return Promise.all(updates);
        },

        ensureUserInitialized() {
          const { auth } = this.props;

          // TODO: Separate data writes

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
            delete userFormData.role;
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
          pushPathTemplate: 'public',

          children: {
            role: 'role',
            displayName: 'displayName',
            photoURL: 'photoURL'
          }
        },

        private: {
          pathTemplate: 'private/$(uid)',
          pushPathTemplate: 'private',

          children: {
            displayRole: 'displayRole',

            data: 'data',   // personal user data (we copy this from firebase auth on first use)
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