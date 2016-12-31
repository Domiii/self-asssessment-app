import { RefWrapper, defaultRefFactory } from 'src/util/firebaseUtil';


export default class QuizzesRef extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizzes'; }

  static getDefault = defaultRefFactory(QuizzesRef);

  constructor(getData, db) {
    super(QuizzesRef.PATH_ROOT, getData, db);
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
