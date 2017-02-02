import { refWrapper } from 'src/util/firebaseUtil';

const ResponseFeedbackRef = refWrapper({
  path: '/conceptResponseFeedback'
});

export default ResponseFeedbackRef;