import { RefWrapper } from 'src/firebaseUtil';
import { paths } from '../db';

export default class QuizProblems extends RefWrapper {
  constructor(db) {
    super(db.ref(), paths.QuizProblems);
  }

  // ######################################################
  // Read
  // ######################################################

  getProblem(data, quizId, problemId) {
    const childPath = `${quizId}/${problemId}`;
    
  }

  getQuizProblems(quizId) {
    const childPath = `${quizId}`;
  }
}
