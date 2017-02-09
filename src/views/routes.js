import React from 'react';
import { isInitialized, isAuthenticated } from 'src/util/firebaseUtil';
import App from './app';
import SignIn from './pages/SignInPage';
import UserProfilePage from './pages/UserProfilePage';
import ConceptsPage from './pages/ConceptsPage';
import { ConceptPlayPage, ChildConcept } from './pages/ConceptPlayPage';


export const paths = {
  ROOT: '/',
  SIGN_IN: 'sign-in',
  USER_PROFILE: 'user',
  CONCEPTS: ':ownerId/:conceptId',
  CONCEPT_PLAY: 'concept-play/:conceptId',
  CONCEPT_PROBLEM: 'problem/:problemId'
};


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
      replace(paths.SIGN_IN);
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
    path: paths.ROOT,
    component: App,
    // redirect: {
    //   from: '*',
    //   to: paths.CONCEPTS
    // },,
    indexRoute: {
      component: ConceptsPage,
      onEnter: requireAuth(getState)
    },
    childRoutes: [
      {
        name: 'sign-in',
        path: paths.SIGN_IN,
        component: SignIn,
        onEnter: requireUnauth(getState)
      },
      {
        name: 'concepts',
        path: paths.CONCEPTS,
        indexRoute: {
          component: ConceptsPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        name: 'user',
        path: paths.USER_PROFILE,
        component: UserProfilePage,
        onEnter: requireAuth(getState)
      },
      {
        name: 'concept-play',
        path: paths.CONCEPT_PLAY,
        component: ConceptPlayPage,
        onEnter: requireAuth(getState),
        childRoutes: [
          {
            path: paths.CONCEPT_PROBLEM,
            component: ConceptPlayPage
          }
        ]
      }
    ]
  };
};
