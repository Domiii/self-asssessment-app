import { RefWrapper } from 'src/util/firebaseUtil';


export default class Quizzes extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizzes'; }

  constructor(getData, db) {
    super(Quizzes.PATH_ROOT, getData, db);
  }

  // ######################################################
  // Read
  // ######################################################

  getQuiz(quizId) {
    const path = `${quizId}`;
    return this.getData(path);
  }

  getQuizzes() {
    return this.rootData;
  }
}
