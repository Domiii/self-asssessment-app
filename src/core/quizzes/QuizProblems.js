import { RefWrapper } from 'src/util/firebaseUtil';


export default class QuizProblems extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizProblems'; }

  constructor(getData, db) {
    super(QuizProblems.PATH_ROOT, getData, db);
  }

  // ######################################################
  // Read
  // ######################################################

  getProblem(quizId, problemId) {
    const path = `${quizId}/${problemId}`;
    return this.getData(path);
  }

  getProblems(quizId) {
    const path = `${quizId}`;
    return this.getData(path);
  }

  getFirstProblemId(quizId) {
    // TODO
  }

  getPreviousProblemId(quizId, currentProblemId) {
    const problems = this.getProblems(quizId);
    // TODO
  }

  getNextProblemId(quizId, currentProblemId) {
    // TODO
  }

  addProblem(quizId, problemData) {
    console.assert(quizId);
    return this.pushChild(`${quizId}`, problemData);

    // TODO: use transaction to get a rolling and unique id
  }

  updateProblem(quizId, problemId, problemData) {
    console.assert(quizId && problemId);
    return this.updateChild(`${quizId}/${problemId}`, problemData);
  }
}
