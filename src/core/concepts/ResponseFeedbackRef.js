import { refWrapper } from 'src/firebaseUtil';

const ResponseFeedbackRef = refWrapper({
  pathTemplate: '/conceptResponseFeedback'
});

export default ResponseFeedbackRef;