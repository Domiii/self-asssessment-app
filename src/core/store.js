import { applyMiddleware, compose, createStore } from 'redux';
import { reduxReactFirebase } from 'redux-react-firebase'

import thunk from 'redux-thunk';
import reducers from './reducers';


export default (firebaseConfig, initialState = {}) => {
  let middleware = applyMiddleware(thunk);

  if (process.env.NODE_ENV !== 'production') {
    // configure redux-devtools-extension
    // @see https://github.com/zalmoxisus/redux-devtools-extension
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      middleware = compose(middleware, devToolsExtension());
    }
  }

  // insert firebase "middleware"
  const createStoreWithFirebase = compose(
    reduxReactFirebase(firebaseConfig)
  )(createStore.bind(null, reducers, initialState, middleware))

  const store = createStoreWithFirebase();

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);
    });
  }

  return store;
};
