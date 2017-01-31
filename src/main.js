import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './core/store';
import Root from './views/root';
import './views/styles/styles.scss';

import firebase from 'firebase';
import firebaseConfig from './config/firebase.cfg';

import { FAIcon } from 'src/views/components/util';

const store = configureStore(firebaseConfig);
const syncedHistory = syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('root');


function render(Root) {
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
}

if (module.hot) {
  module.hot.accept('./views/root', () => {
    render(require('./views/root').default);
  });
}

// show a loading indicator
ReactDOM.render(
  (<FAIcon name="cog" spinning={true} className="color-red" />),
  rootElement
);

// Wait until after authentication has finished before rendering the root
firebase.auth().onAuthStateChanged(function (authData) {
  render(Root);
});
