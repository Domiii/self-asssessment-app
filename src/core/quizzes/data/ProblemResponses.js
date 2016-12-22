import { RefWrapper } from 'src/firebaseUtil';


export default class ProblemResponses extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizProblemResponses'; }

  // defines the path that we are usually interested in
  static getDefaultPath(uid, quizId) { return `${ProblemResponses.PATH_ROOT}/${uid}/${quizId}`; }

  constructor(db) {
    super(db, ProblemResponses.PATH_ROOT);
  }

  // ######################################################
  // Read
  // ######################################################

  getResponse(data, uid, quizId, problemId) {
    return data.getIn([uid, quizId, problemId], null);
  }

  getResponses(data, uid, quizId) {
    return data.getIn([uid, quizId], null);
  }


  // ######################################################
  // Write
  // ######################################################

  respondToProblem(uid, quizId, problemId, understanding) {
    this.updateChild({`${uid}/${quizId}/${problemId}/understanding`: understanding});
  }
}
