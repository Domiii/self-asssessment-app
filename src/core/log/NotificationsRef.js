import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';

// TODO: Define dataProvider settings, 
//    so we can easily batch/add requests for all the context data?

export const NotificationTypeSettings = {
  list: [
    {
      // there has been a change to any sort of concept data
      name: 'conceptUpdate',
      parameters: {
        conceptId: 'conceptId'
      },

      subtypeSettings: {
        public: {
          // concept made public
        },

        unpublic: {
          // concept made unpublic
        },

        edit: {
          // concept contents (or checks) have been edited
        },

        delete: {
          // concept has been deleted
        }
      },

      // get URL to the given concept
      getUrl(notification) {
        // TODO: 
      }
    },

    {
      name: 'checkReponse',
      parameters: {
        conceptId: 'conceptId',
        checkId: 'checkId',
        status: 'status'
      },

      subtypeSettings: null,  // TODO: settings per response type

      // get URL to the given concept
      getUrl(notification) {
        // TODO:
      }
    }
  ]
};

NotificationTypeSettings.byName = _.keyBy(NotificationTypeSettings.list, 'name');

const NotificationsRef = makeRefWrapper({
  pathTemplate: '/notifications',

  makeQuery(args) {
    // TODO: get some notifications
    return {
      orderByChild: 'null',
      equalTo: 1
    };
  },

  methods: {
    addNotification(type, subtype, args) {
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

      return this.push({
        uid: this.props.uid,
        type,
        subtype,
        args
      });
    }
  },

  children: {
    entry: {
      pathTemplate: '$(notificationId)',

      children: {
        uid: 'uid',
        type: 'type',
        subtype: 'subtype',
        args: 'args',
        updatedAt: 'updatedAt',
      }
    }
  }
});

export default NotificationsRef;