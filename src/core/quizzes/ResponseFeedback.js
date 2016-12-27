import { RefWrapper } from 'src/util/firebaseUtil';


export default class ResponseFeedback extends RefWrapper {
  // the root of all objects of this type
  static get PATH_ROOT() { return '/quizResponseFeedback'; }

  constructor(getData, db) {
    super(ResponseFeedback.PATH_ROOT, getData, db);
  }
}