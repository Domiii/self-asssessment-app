import React from 'react';
import { isInitialized, isAuthenticated } from 'src/util/firebaseUtil';
import App from './app';
import SignIn from './pages/sign-in';
import UserProfilePage from './pages/user-profile';
import QuizEditorPage from './pages/quiz-editor';
import QuizzesPage from './pages/quizzes';
import { QuizPage, QuizProblem } from './pages/quiz';


export const paths = {
  ROOT: '/',
  SIGN_IN: 'sign-in',
  USER_PROFILE: 'user',
  QUIZZES: '',
  QUIZ_EDITOR: 'quiz-editor/:quizId',
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
      replace(paths.QUIZZES);
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
    // },
    childRoutes: [
      {
        name: 'sign-in',
        path: paths.SIGN_IN,
        component: SignIn,
        onEnter: requireUnauth(getState)
      },
      {
        name: 'user',
        path: paths.USER_PROFILE,
        component: UserProfilePage,
        onEnter: requireAuth(getState)
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
        name: 'quiz-editor',
        path: paths.QUIZ_EDITOR,
        component: QuizEditorPage,
        onEnter: requireAuth(getState)
      },
      {
        name: 'quiz',
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
