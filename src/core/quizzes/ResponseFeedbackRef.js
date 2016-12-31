import { RefWrapper } from 'src/util/firebaseUtil';
import { makeGetDataDefault } from 'src/util/firebaseUtil';


export default class ResponseFeedbackRef extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizResponseFeedback'; }
  
  static getDefault = defaultRefFactory(QuizzesRef);

  constructor(getData, db) {
    super(ResponseFeedbackRef.PATH_ROOT, getData, db);
  }
}