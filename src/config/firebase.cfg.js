export const firebaseConfig = {
  apiKey: "AIzaSyAZMBTlXHPO5PYpBj0UliY63c6kFITom3g",
  authDomain: "super-awesome-buffet.firebaseapp.com",
  databaseURL: "https://super-awesome-buffet.firebaseio.com",
  projectId: "super-awesome-buffet",
  storageBucket: "super-awesome-buffet.appspot.com",
  messagingSenderId: "685592590103"
};

export const reduxFirebaseConfig = {
  //userProfile: 'users', // root that user profiles are written to
  enableLogging: false, // enable/disable Firebase Database Logging
  updateProfileOnLogin: false // enable/disable updating of profile on login
  // profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
};