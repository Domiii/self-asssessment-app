import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';

export const ConceptUpdateTypes = {
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
};

// TODO: Define dataProvider settings, 
//    so we can easily batch/add requests for all the context data?

export const NotificationTypeSettings = {
  list: [
    {
      // there has been a change to any sort of concept data
      name: 'conceptUpdate',
      parameters: {
        uid: 'uid',
        conceptId: 'conceptId',
        updateType: 'type'
      },

      // get URL to the given concept
      getUrl(notification) {
        // TODO: 
      }
    },

    {
      name: 'checkReponse',
      parameters: {
        uid: 'uid',
        conceptId: 'conceptId',
      },

      // get URL to the given concept
      getUrl(notification) {
        // TODO:
      }
    }
  ]
};

NotificationTypeSettings.byName = _.keyBy(NotificationTypeSettings.list, 'name');

export const NotificationsRef = makeRefWrapper({
  pathTemplate: '/notifications',

  methods: {
    serializeArgs(args) {
      try {
        args = args || {};
        return JSON.stringify(args);
      }
      catch (err) {
        console.error('[ERROR]', err, 'Could not serialize Notification args: ' + args);
      }
    },

    deserializeArgs(argsString) {
      try {
        argsString = argsString || '';
        return JSON.parse(argsString);
      }
      catch (err) {
        console.error('[ERROR]', err, 'Could not parse Notification args: ' + argsString);
      }
    },

    addNotification(entry) {
      // start notification verification process
      if (!entry || !entry.args || !entry.type || !NotificationTypeSettings.byName[entry.type]) {
        console.error(`[ERROR] Invalid notification: ` + JSON.stringify(entry));
        return null;
      }
      const settings = NotificationTypeSettings.byName[entry.type];

      // check args against parameters
      var parameters = settings.parameters;
      var args = entry.args;
      for (var parameterName in parameters) {
          var param = parameters[i];
          var arg = args[parameterName];
          if (arg === undefined) {
              console.error(`[ERROR] Notification of type ${entry.type} missing argument: ` + parameterName);
              return null;
          }
      };

      // serialize arguments
      var serializedArgs = this.serializeArgs(args);
      if (!serializedArgs) return;

      console.log('new log entry: ' + entry.type);

      return true;
    }
  },

  children: {
    entry: {
      pathTemplate: '$(notificationId)',

      children: {
        uid: 'uid',
        updatedAt: 'updatedAt',
        actionType: 'action',
        args: 'args'
      }
    }
  }
});