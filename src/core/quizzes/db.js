export const paths = {
  QuizProblems: '/quizProblems',

  QuizProgress: '/quizProgress'
};

export const getPath = {
  problems(quizId) { return `${paths.QuizProblems}/${quizId}`; },
  
  progress(uid, quizId) { return `${paths.QuizProgress}/${uid}/${quizId}`; },
};