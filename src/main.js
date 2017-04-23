// import third-party CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import 'font-awesome/css/font-awesome.min.css';

import 'react-flex/index.css';

// import our own main CSS
import 'src/views/styles/styles.scss';

// import JS
// import 'bootstrap';   // bootstrap JS
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './core/store';
import Root from './views/root';

import firebase from 'firebase';
import firebaseConfig from './config/firebase.cfg';

import { LoadOverlay } from 'src/views/components/overlays';


// GO!
const store = configureStore(firebaseConfig);
const syncedHistory = syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('root');


if (module.hot) {
  module.hot.accept('./views/root', () => {
    render(require('./views/root').default);
  });
}

// show a message while logging in
ReactDOM.render(
  <LoadOverlay message="logging in..." className="color-light-red" />,
  rootElement
);

// Wait until after authentication has finished before rendering the root
firebase.auth().onAuthStateChanged(function (authData) {
  // done! Let's kick this thing into gear!
  
  // try {
  ReactDOM.render(
    <AppContainer>
      <Root history={syncedHistory} store={store} />
    </AppContainer>,
    rootElement
  );
    // console.log("render success");
  // }
  // catch (err) {
  //   console.error(err.stack);
  // }
});