import React from 'react';
import { isInitialized, isAuthenticated } from 'src/util/firebaseUtil';
import App from './app';
import SignIn from './pages/sign-in';
import QuizzesPage from './pages/quizzes';
import { QuizPage, QuizProblem } from './pages/quiz';


export const paths = {
  ROOT: '/',
  SIGN_IN: 'sign-in',
  QUIZ: 'quiz/:quizId',
  QUIZ_PROBLEM: 'problem/:problemId'
};

// TODO: auth checks not working yet

const requireLoading = getState => {
  return (nextState, replace) => {
    return !isInitialized(getState().firebase);
  }
};

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
      replace(paths.QUIZZES);
    }
  };
};

export const getRoutes = getState => {
  return {
    path: paths.ROOT,
    component: App,
    childRoutes: [
      {
        path: paths.SIGN_IN,
        component: SignIn,
        onEnter: requireUnauth(getState)
      },
      {
        path: paths.QUIZZES,
        indexRoute: {
          component: QuizzesPage,
          onEnter: requireAuth(getState)
        }
      },
      {
        path: paths.QUIZ,
        component: QuizPage,
        onEnter: requireAuth(getState),
        childRoutes: [
          {
            path: paths.QUIZ_PROBLEM,
            component: QuizProblem
          }
        ]
      }
    ]
  };
};
