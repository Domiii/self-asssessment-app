export const getPath = {
  userProgress(quizId, uid) { return `/quizProgress/${uid}/${quizId}`; },
  problems(quizId) { return `/quizProblems/${quizId}`; },
  problem(quizId, problemId) { return `/quizProblems/${quizId}/${problemId}`; }
};