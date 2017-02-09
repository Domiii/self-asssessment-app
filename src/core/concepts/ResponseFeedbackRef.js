import { refWrapper } from 'src/util/firebaseUtil';

const ResponseFeedbackRef = refWrapper({
  pathTemplate: '/conceptResponseFeedback'
});

export default ResponseFeedbackRef;