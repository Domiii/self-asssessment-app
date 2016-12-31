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
    return this.getData(quizId);
  }

  getQuizzes() {
    return this.rootData;
  }

  addQuiz(quiz) {
    this.push(quiz);
  }
}
