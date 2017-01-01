import { refWrapper } from 'src/util/firebaseUtil';

const ResponseFeedbackRef = refWrapper({
  path: '/quizResponseFeedback'
});

export default ResponseFeedbackRef;