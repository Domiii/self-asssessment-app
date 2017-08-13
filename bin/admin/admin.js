// see: https://firebase.google.com/docs/reference/admin/node/

import admin from "firebase-admin";
import size from 'lodash/size';


// ########################################
// get started, define some data
// ########################################

const enableLogging = false;

const secretPath = './secret.json';

const appSettings = {
  credential: admin.credential.cert(require(secretPath)),
  databaseURL: "https://super-awesome-buffet.firebaseio.com"
};

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

if (enableLogging) {
  admin.database.enableLogging(true);
}

global.app = admin.initializeApp(appSettings);
global.db = admin.database();


// ########################################
// setup application listeners
// ########################################

db.ref('.info/connected').on('value', function(connectedSnap) {
  //console.log('CONNECTION STATUS: ' + connectedSnap.val());
  if (connectedSnap.val() === true) {
    isInitialized = true;
    console.log('#####################Connected#####################');
  } else {
    if (isInitialized) {
      console.log('#####################Disonnected#####################');
    }
  }
});

function migration(name) {
  const migration = require('./migrations/' + name);
  console.log('##############################');
  console.log('migration: ' + name);

  const res = migration().
    then(() => {
      console.log();
    });
  return res;
}

function runScripts() {
  return Promise.all([
    //migration('2017_08_10_users');
  ]);
}

try {
  console.log('Starting admin scripts...');
  
  runScripts().
    catch(err => {
      console.error(err.stack);
      process.exit(-1);
    }).
    then(() => {
      console.log('Finished.');
      process.exit(0);
    });
}
catch (err) {
  console.error(err.stack);
  process.exit(-1);
}