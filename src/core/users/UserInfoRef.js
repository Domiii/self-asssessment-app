import { refWrapper } from 'src/util/firebaseUtil';

// access to the current user's info
const UserInfoRef = refWrapper({
  path: '/users',

  children: {
    user: {
      path: '$(uid)',
      children: {
        isAdmin: 'isAdmin', 
        userName: 'data/userName',
        email: 'data/email',
        locale: 'data/locale'
      }
    }
  }
});

export default UserInfoRef;