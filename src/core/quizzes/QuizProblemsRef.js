import { RefWrapper } from 'src/util/firebaseUtil';
import { makeGetDataDefault } from 'src/util/firebaseUtil';
import _ from 'lodash';


export default class QuizProblemsRef extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizProblems'; }

  constructor(getData, db) {
    super(QuizProblemsRef.PATH_ROOT, getData, db);
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

  getFirstProblem(quizId) {
    const firstId = this.getFirstProblemId(quizId);
    return firstId && this.getProblems(quizId)[firstId];
  }

  getFirstProblemId(quizId) {
    const problems = this.getProblems(quizId);
    if (!problems) {
      return null;
    }
    let firstNum = 99999999999;
    let firstKey = null;
    for (let key in problems) {
      const prob = problems[key];
      if (prob.num < firstNum) {
        firstNum = prob.num;
        firstKey = key;
      }
    }
    return firstKey;
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
