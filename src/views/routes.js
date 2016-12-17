import { isAuthenticated } from 'src/core/auth';
import App from './app';
import SignIn from './pages/sign-in';
import Quizzes from './pages/quizzes';
import Quiz from './pages/quiz';
import QuizQuestion from './pages/quiz-question';


export const paths = {
  ROOT: '/',
  SIGN_IN: 'sign-in',
  QUIZ: 'quiz/:quizId',
  QUIZ_QUESTION: 'question/:questionId',
};


const requireAuth = getState => {
  return (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
    }
  };
};

const requireUnauth = getState => {
  return (nextState, replace) => {
    if (isAuthenticated(getState())) {
      replace(paths.QUIZ);
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
          component: Quizzes,
          onEnter: requireAuth(getState)
        }
      },
      {
        path: paths.QUIZ,
        indexRoute: {
          component: Quizzes,
          onEnter: requireAuth(getState)
        },
        childRoutes: [
          {
            path: paths.QUIZ_QUESTION,
            component: Quiz,
            onEnter: requireAuth(getState),
            indexRoute: {
              component: Quiz,
              onEnter: requireAuth(getState)
            }
          }
        ]
      }
    ]
  };
};
