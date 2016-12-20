export paths = {
  QuizProblems: '/quizProblems',
  ProblemResponses: '/quizProblemResponses',
  QuizProgress: '/quizProgress'
};

export const getPath = {
  response(uid, problemId) { return `${paths.ProblemResponse}/${uid}/${problemId}`; },
  problems(quizId) { return `${paths.QuizProblem}/${quizId}`; },
  
  progress(uid, quizId) { return `${paths.QuizProgress}/${uid}/${quizId}`; },
};