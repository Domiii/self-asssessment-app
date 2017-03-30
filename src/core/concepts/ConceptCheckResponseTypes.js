const responseTypes = {
  yesNo: {
    yes: {
      title_en: 'yes',
      progress: 100
    },
    no: {
      title_en: 'no',
      progress: 0
    }
  },

  checkCross: {
    check: {
      title_en: 'good',
      progress: 100,
      icon: 'check',
      className: 'color-green'
    },
    cross: {
      title_en: 'bad',
      progress: 0,
      icon: 'remove',
      className: 'color-red'
    }
  },


};

const commonResponses = {
  wantToLearnSoon: {
    //title_en: ''
  },
  dontCare: {
    status: 'remove'
  },
  dontUnderstand: {
    progress: 0
  },
  reportProblem: {
    progress: 0
  }
};

export default responseTypes;