import { RefWrapper } from 'src/util/firebaseUtil';


export default class QuizProgress extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizProgress'; }

  constructor(getData, db) {
    super(QuizProgress.PATH_ROOT, getData, db);
  }

  // ######################################################
  // Read
  // ######################################################

  getProgress(uid, quizId, childPath) {
    childPath = childPath && '/' + childPath || '';
    const path = `${uid}/${quizId}${childPath}`;
    return this.getData(path);
  }

  gotoProblem(uid, quizId, problemId) {
    const path = `${uid}/${quizId}`;
    this.updateChild(path, { currentProblemId: problemId });
  }

  getCurrentProblemId(uid, quizId) {
    return getProgress(uid, quizId, 'currentProblemId');
  }
}
