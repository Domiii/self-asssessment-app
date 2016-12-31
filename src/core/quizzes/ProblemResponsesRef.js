import { RefWrapper } from 'src/util/firebaseUtil';
import { makeGetDataDefault } from 'src/util/firebaseUtil';


export default class ProblemResponsesRef extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizProblemResponses'; }

  static getDefault(state) { 
    const getData = makeGetDataDefault(state);
    return new QuizzesRef(getData);
  }

  constructor(getData, db) {
    super(ProblemResponsesRef.PATH_ROOT, getData, db);
  }

  // ######################################################
  // Read
  // ######################################################

  getResponse(uid, quizId, problemId) {
    const path = `${uid}/${quizId}/${problemId}`;
    return this.getData(path);
  }

  getResponses(uid, quizId) {
    const path = `${uid}/${quizId}`;
    return this.getData(path);
  }


  // ######################################################
  // Write
  // ######################################################

  respondToProblem(uid, quizId, problemId, understanding) {
    this.updateChild({[`${uid}/${quizId}/${problemId}/understanding`]: understanding});
  }
}
