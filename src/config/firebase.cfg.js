export const firebaseConfigs = {
  production: {
    apiKey: "AIzaSyAZMBTlXHPO5PYpBj0UliY63c6kFITom3g",
    authDomain: "super-awesome-buffet.firebaseapp.com",
    databaseURL: "https://super-awesome-buffet.firebaseio.com",
    projectId: "super-awesome-buffet",
    storageBucket: "super-awesome-buffet.appspot.com",
    messagingSenderId: "685592590103"
  },

  test: {
    apiKey: "AIzaSyDawQhJUXrQ4oxjsmeRB8hOH9IovrRhSyc",
    authDomain: "test-self-assessment.firebaseapp.com",
    databaseURL: "https://test-self-assessment.firebaseio.com",
    projectId: "test-self-assessment",
    storageBucket: "test-self-assessment.appspot.com",
    messagingSenderId: "110324202879"
  }
};

export const reduxFirebaseConfig = {
  //userProfile: 'users', // root that user profiles are written to
  enableLogging: false, // enable/disable Firebase Database Logging
  updateProfileOnLogin: false // enable/disable updating of profile on login
  // profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
};