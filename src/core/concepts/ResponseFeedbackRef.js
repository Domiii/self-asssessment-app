import { makeRefWrapper } from 'src/firebaseUtil';

const ResponseFeedbackRef = makeRefWrapper({
  pathTemplate: '/conceptResponseFeedback'
});

export default ResponseFeedbackRef;