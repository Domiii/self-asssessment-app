import React from 'react';
import { isInitialized, isAuthenticated } from 'src/util/firebaseUtil';
import App from './app';
import SignIn from './pages/SignInPage';
import UserProfilePage from './pages/UserProfilePage';
import QuizViewPage from './pages/QuizViewPage';
import QuizzesPage from './pages/QuizzesPage';
import { QuizPage, QuizProblem } from './pages/QuizPage';


export const paths = {
  ROOT: '/',
  SIGN_IN: 'sign-in',
  USER_PROFILE: 'user',
  QUIZZES: '',
  QUIZ_VIEW: 'quiz-view/:quizId',
  QUIZ: 'quiz/:quizId',
  QUIZ_PROBLEM: 'problem/:problemId'
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
    //   to: paths.QUIZZES
    // },,
    indexRoute: {
      component: QuizzesPage,
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
        name: 'quizzes',
        path: paths.QUIZZES,
        indexRoute: {
          component: QuizzesPage,
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
        name: 'quiz-view',
        path: paths.QUIZ_VIEW,
        component: QuizViewPage,
        onEnter: requireAuth(getState)
      },
      {
        name: 'quiz-play',
        path: paths.QUIZ,
        component: QuizPage,
        onEnter: requireAuth(getState),
        childRoutes: [
          {
            path: paths.QUIZ_PROBLEM,
            component: QuizPage
          }
        ]
      }
    ]
  };
};
