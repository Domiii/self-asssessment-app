import { makeRefWrapper } from 'src/firebaseUtil';


// TODO: Likes + maybe some more responses toward entire concepts
/*
  like: {
    title_en: 'Like!',
    icon: 'heart',
    className: 'color-red',
    bsStyle: 'warning'
  },
*/

const SubmissionFeedbackRef = makeRefWrapper({
  pathTemplate: '/submissionFeedback',

  indices: {
    reviewerId: ['reviewerId'],
    submissionId: ['submissionId'],
    conceptId: ['conceptId'],
    status: ['status']
  },


  queryString(args) {
    const limit = args && args.limit;
    const filter = args && args.filter;
    const populates = args && args.populates;

    const q = {
      queryParams: []
    };

    if (limit) {
      q.queryParams.push(`limitToLast=${limit}`);
    }

    if (filter && filter.length) {
      //console.log('filter: ' + JSON.stringify(filter));
      q.queryParams.push(
        `orderByChild=${filter[0]}`,
        `equalTo=${filter[1]}`
      );
    }

    if (populates) {
      q.populates = populates;
    }

    return q;
  },


  methods: {
    addFeedback(submissionId, conceptId, submitterId, status, text) {
      const { uid } = this.props;
      if (!uid) throw new Error('missing uid');

      // add feedback status entry
      const newFeedbackRef = this.push({
        submissionId,
        conceptId,
        submitterId,
        reviewerId: uid,

        status
      });

      // add feedback text using the newly generated id
      const feedbackId = newRef.key;
      this.set_text(feedbackId, feedback.text);

      return newFeedbackRef;
    },

    updateFeedback(feedbackId, status, text) {
      const statusPath = SubmissionFeedbackRef.feedback.status.getPath({ feedbackId });
      const reviewerPath = SubmissionFeedbackRef.feedback.reviewerId.getPath({ feedbackId });
      const textPath = SubmissionFeedbackRef.feedbackDetails.text.getPath({ feedbackId });

      const { uid } = this.props;
      if (!uid) throw new Error('missing uid');

      return this.update({
        [reviewerPath]: uid,
        [statusPath]: status, 
        [textPath]: text
      });
    }
  },

  children: {
    feedback: {
      pathTemplate: 'data/$(feedbackId)',

      children: {
        submissionId: 'submissionId',

        conceptId: 'conceptId',
        submitterId: 'submitterId',

        reviewerId: 'reviewerId',

        // feedback status
        status: 'status'
      }
    },

    feedbackDetails: {
      pathTemplate: 'details/$(feedbackId)',

      children: {
        text: 'text'
      }
    }
  }
});

export default SubmissionFeedbackRef;