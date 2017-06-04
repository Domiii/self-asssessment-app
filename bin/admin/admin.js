// see: https://firebase.google.com/docs/reference/admin/node/

import admin from "firebase-admin";
import size from 'lodash/size';


// ########################################
// get started, define some data
// ########################################

const secretPath = 'secret.json';

import fs from 'fs';
import process from 'process';
if (!fs.existsSync(secretPath)) {
    console.error('Could not find private key file: ' + secretPath);
    console.error('');
    console.error('1. Go to your firebase console -> settings -> Service Accounts -> node.js.');
    console.error('2. Make sure, the settings align with the settings in this file');
    console.error('3. Hit "Generate New Private Key" (which downloads a JSON file)');
    console.error('4. Rename the key file to "secret.json" and put it in this directory, next to this file!');
    console.error('5. Done.');
    process.exit(-1);
}

let isInitialized = false;

const app = admin.initializeApp({
  credential: admin.credential.cert(secretPath),
  databaseURL: "https://super-awesome-buffet.firebaseio.com"
});

const db = admin.database();


// ########################################
// setup application listeners
// ########################################

db.ref('.info/connected').on('value', function(connectedSnap) {
  if (connectedSnap.val() === true) {
    isInitialized = true;
    console.log('#####################Connected#####################');
  } else {
    if (isInitialized) {
      console.log('#####################Disonnected#####################');
    }
  }
});


// ########################################
// Go!
// ########################################

const usersRef = db.ref('users');
usersRef.once('value')
  .then(snapshot => {
    const users = snapshot.val();
    console.log('There are ' + size(users) + ' users!');
  })
  .catch(err => console.error(err.stack));