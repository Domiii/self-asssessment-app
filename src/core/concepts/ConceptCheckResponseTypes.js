const ConceptCheckResponseTypes = {
  default: {
    done: {
      title_en: 'Played around with it. Figured it out. Works for me! Got it!',
      icon: 'check',
      bsStyle: 'success'
    },
    addToList: {
      title_en: 'I want to learn this! Add to my short-list.',
      icon: 'plus',
      bsStyle: 'success'
    },
    helpMe: {
      title_en: 'I would like some help with this.',
      icon: 'ambulance',
      bsStyle: 'warning'
    },

    reportProblem: {
      title_en: 'I think, there is something wrong with the wording, there are typos or some other kind of issue that needs fixing.',
      icon: 'exclamation-circle',
      className: 'color-yellow',
      bsStyle: 'danger'
    }
  },
  // yesNo: {
  //   yes: {
  //     title_en: 'yes',
  //     progress: 100
  //   },
  //   no: {
  //     title_en: 'no',
  //     progress: 0
  //   }
  // },

  // checkCross: {
  //   check: {
  //     title_en: 'good',
  //     progress: 100,
  //     icon: 'check',
  //     className: 'color-green'
  //   },
  //   cross: {
  //     title_en: 'bad',
  //     progress: 0,
  //     icon: 'remove',
  //     className: 'color-red'
  //   }
  // },
};

export default ConceptCheckResponseTypes;