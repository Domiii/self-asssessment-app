import { refWrapper } from 'src/util/firebaseUtil';

const DBStatusRef  = refWrapper({
  pathTemplate: '/dbState',

  methods: {
    onBeforeWrite() {
      return 
    }
  },

  children: {
    current: {
      pathTemplate: 'current',

      children: {
        version: 'version',
        updatedAt: 'updatedAt'
      }
    }
  }
});

export default DBStatusRef;