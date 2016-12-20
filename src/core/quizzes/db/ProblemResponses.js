import { RefWrapper } from 'src/firebaseUtil';
import { paths } from '../db';


export default class ProblemResponses extends RefWrapper {
  constructor(db) {
    super(db, paths.ProblemResponses);
  }

  // ######################################################
  // Read
  // ######################################################

  getResponse(uid, quizId, problemId) {
    const childPath = `${uid}/${quizId}/${problemId}`;
  }

  getQuizResponses(uid, quizId) {
    const childPath = `${uid}/${quizId}`;
  }


  // ######################################################
  // Write
  // ######################################################

  respondToProblem(db, problemId, understanding) {
    const childPath = `${quizId}/${problemId}`;
  }
}
