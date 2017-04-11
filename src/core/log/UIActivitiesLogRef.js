import { refWrapper } from 'src/util/firebaseUtil';
import _ from 'lodash';


const UIActivitiesLogRef = refWrapper({
  pathTemplate: '/logs/uiActivities',

  children: {
    uid: 'uid',
    startTime: 'startTime',
    duration: 'duration',

    nCharsTyped: 'nCharsTyped',
    nClicks: 'nClicks',
    other: 'other',

    currentPage: 'currentPage',
    currentPageArgs: 'currentPageArgs',
    currentPageStateInfo: 'currentPageStateInfo'
  }
});

export default UIActivitiesLogRef;