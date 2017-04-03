const ConceptCheckResponseTypes = {
  default: {
    done: {
      title_en: 'Played around with it. Figured it out. Works for me! Got it!',
      title_zh: '我玩過，已經會用了。沒問題的！',
      icon: 'check',
      className: 'color-green',
      bsStyle: 'success'
    },
    addToList: {
      title_en: 'I want to learn this! Add to my short-list.',
      title_zh: '我喜歡這題目。加到我的快捷學習清單～',
      icon: 'plus',
      bsStyle: 'success'
    },
    helpMe: {
      title_en: 'I would like some help with this.',
      title_zh: '我需要一點幫忙～',
      icon: 'ambulance',
      className: 'color-red',
      bsStyle: 'success'
    },

    reportProblem: {
      title_en: 'I think, there is something wrong with this.',
      title_zh: '我覺得這題目有問題',
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