import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';

// TODO: Define dataProvider settings, 
//    so we can easily batch/add requests for all the context data?

export const NotificationTypeSettings = {
  list: [
    {
      // there has been a change to any sort of concept data
      name: 'checkResponse',
      parameters: {
        conceptId: 'conceptId',
        checkId: 'checkId',
        status: 'status'
      },

      isPublic(subtype, args) {
        return subtype === 'done' && args.status;
      },

      // get URL to the given concept
      getUrl(notification) {
        // TODO: 
      }
    },

    {
      name: 'conceptResponse',
      parameters: {
        conceptId: 'conceptId',
        text: 'text',
        hasSubmitted: 'hasSubmitted'
      },

      isPublic(subtype, args) {
        return args.hasSubmitted;
      },

      subtypeSettings: null,  // TODO: settings per response type

      // get URL to the given concept
      getUrl(notification) {
        // TODO:
      }
    },
    // {
    //   name: 'conceptEdited',


    //   subtypeSettings: {
    //     public: {
    //       // concept made public
    //     },

    //     unpublic: {
    //       // concept made unpublic
    //     },

    //     edit: {
    //       // concept contents (or checks) have been edited
    //     },

    //     delete: {
    //       // concept has been deleted
    //     }
    //   },
    // }
  ]
};

NotificationTypeSettings.byName = _.keyBy(NotificationTypeSettings.list, 'name');

function makeNotificationEntrySpecs(prefix) {
  return { 
    [`${prefix}_entry`] : {
      pathTemplate: '$(notificationId)',

      children: {
        [`${prefix}_uid`]: 'uid',
        [`${prefix}_type`]: 'type',
        [`${prefix}_subtype`]: 'subtype',
        [`${prefix}_args`]: 'args',
        [`${prefix}_updatedAt`]: 'updatedAt',
      }
    }
  };
}

const NotificationsRef = makeRefWrapper({
  pathTemplate: '/notifications',

  queryString(args) {
    const limit = args && args.limit || 20;
    const filter = args && args.filter;

    const q = {
      limitToLast: limit
    };

    if (filter) {
      console.log('filter: ' + JSON.stringify(filter));
      Object.assign(q, {
        orderByChild: filter[0],
        equalTo: filter[1],
      });
    }

    return q;
  },

  methods: {
    addNotification(type, subtype, args) {
      // TODO: Determine where to store this

      // start notification verification process
      if (!type || !args || !NotificationTypeSettings.byName[type]) {
        console.error(`[ERROR] Invalid notification type: ` + type);
        return null;
      }
      const settings = NotificationTypeSettings.byName[type];

      // check args against parameters
      var parameters = settings.parameters;
      for (var parameterName in parameters) {
        //var param = parameters[i];
        if (args[parameterName] === undefined) {
          console.error(`[ERROR] Notification of type "${type}" missing argument: ` + parameterName);
          return null;
        }
      };

      const childPath = settings.isPublic(subtype, args) ?
        'public' :
        'other';

      return this.pushChild(childPath, {
        uid: this.props.uid,
        type,
        subtype,
        args
      });
    }
  },

  children: {
    public: { 
      pathTemplate: 'public',
      children: makeNotificationEntrySpecs('public') // copy
    },

    other: {
      pathTemplate: 'other',
      children: makeNotificationEntrySpecs('other') // copy
    }
  }
});

export default NotificationsRef;