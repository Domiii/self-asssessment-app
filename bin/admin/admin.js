// see: https://firebase.google.com/docs/reference/admin/node/

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert("secret.json"),
  databaseURL: "https://test-app-3ecc2.firebaseio.com"
});

const db = admin.database();

const usersRef = db.ref('users');
usersRef.once('value', (snapshot) => {
  const users = snapshot.val();
  console.log(users);
});
usersRef.on('child_added', (snapshot) => {
  const user = snapshot.val();
  console.log(user);
});

console.log("Initialized.");

// uid jGkqPSeuujXazrDLYtAK1DZG1IF2