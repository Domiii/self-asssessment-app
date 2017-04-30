import React from 'react';
import { isInitialized, isAuthenticated } from 'src/firebaseUtil';

import { routeNames, routeTemplates } from './routes';

import App from './app';

import SignInPage from './pages/SignInPage';
import UserProfilePage from './pages/UserProfilePage';
import ConceptsPage from './pages/ConceptsPage';
import NotificationPage from './pages/NotificationPage';
import TestPage from './pages/TestPage';
//import { ConceptPlayPage, ChildConcept } from './pages/ConceptPlayPage';

// const requireLoading = getState => {
//   return (nextState, replace) => {
//     if (!isInitialized(getState().firebase)) {
//       replace
//     }
//   }
// };

const requireAuth = getState => {
  return (nextState, replace) => {
    if (!isAuthenticated(getState().firebase)) {
      replace(routeNames.SIGN_IN);
    }
  };
};

const requireUnauth = getState => {
  return (nextState, replace) => {
    if (isAuthenticated(getState().firebase)) {
      replace('/');
    }
  };
};

export const getRoutes = getState => {
  return {
    path: routeNames.ROOT,
    component: App,
    // redirect: {
    //   from: '*',
    //   to: routeNames.CONCEPTS
    // },,
    indexRoute: {
      component: ConceptsPage,
      onEnter: requireAuth(getState)
    },
    childRoutes: [
      {
        name: routeNames.SIGN_IN,
        path: routeTemplates.SIGN_IN,
        component: SignInPage,
        onEnter: requireUnauth(getState)
      },
      {
        name: routeNames.USER_PROFILE,
        path: routeTemplates.USER_PROFILE,
        component: UserProfilePage,
        onEnter: requireAuth(getState)
      },
      {
        name: routeNames.CONCEPTS,
        path: routeTemplates.CONCEPTS,
        indexRoute: {
          component: ConceptsPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        name: routeNames.CONCEPTS,
        path: routeTemplates.CONCEPT_MODE,
        indexRoute: {
          component: ConceptsPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        name: routeNames.CONCEPT_VIEW,
        path: routeTemplates.CONCEPT_VIEW,
        indexRoute: {
          component: ConceptsPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        name: routeNames.CONCEPT_VIEW,
        path: routeTemplates.CONCEPT_VIEW_MODE,
        indexRoute: {
          component: ConceptsPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        name: routeNames.NOTIFICATIONS,
        path: routeTemplates.NOTIFICATIONS,
        indexRoute: {
          component: NotificationPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        name: routeNames.SUBMISSIONS,
        path: routeTemplates.SUBMISSIONS,
        indexRoute: {
          component: NotificationPage,
          onEnter: requireAuth(getState),
          filter: ['type', 'conceptResponse']
        }
      },
      // {
      //   name: routeNames.TEST,
      //   path: routeTemplates.TEST,
      //   onEnter: requireAuth(getState),
      //   childRoutes: [
      //     {
      //       component: TestPage,
      //       onEnter: requireAuth(getState)
      //     }
      //   ]
      // }
    ]
  };
};
