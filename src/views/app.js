import DBStatusRef from 'src/core/DBStatusRef';
import { UserInfoRef } from 'src/core/users';
import { startLogging } from 'src/core/users';
import { isInitialized } from 'src/firebaseUtil';
import { createSelector } from 'reselect';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { firebaseConnect, helpers } from 'react-redux-firebase'
import Header from './components/header';
import { FAIcon } from 'src/views/components/util';
import { lookupLocalized } from 'src/util/localizeUtil';

import { Overlay, LoadOverlay } from 'src/views/components/overlays';

const { pathToJS } = helpers;

console.log('starting app...');


// our firebase utility needs a set of all paths
const mapPropsToPaths = (props, Firebase) => {
  const uid = Firebase._.authUid;
  const paths = [
    DBStatusRef.makeQuery()
  ];
  if (uid) {
    paths.push(UserInfoRef.user.makeQuery({uid}));
  }
  return paths;
};

const mapStateToProps = ({ firebase }, ownProps) => {
  const auth = pathToJS(firebase, 'auth');
  const dBStatusRef = DBStatusRef(firebase);

  const props = {
    signOut() {
      try {
        ownProps.firebase.logout();
      }
      catch (err) {
        console.error(err.stack);
      }
    },
    dBStatusRef,
    clientVersion: dBStatusRef.version()
  };

  if (auth && auth.uid) {
    // TODO: Move this to componentWillMount
    //    see: https://firebase.google.com/docs/reference/node/firebase.auth.Auth#onAuthStateChanged
    props.userInfoRef = UserInfoRef.user(firebase, {auth, uid: auth.uid});
    props.userInfoRef.ensureUserInitialized();
  }

  return props;
};

const mapDispatchToProps = dispatch => ({});


@firebaseConnect(mapPropsToPaths)
@connect(mapStateToProps, mapDispatchToProps)
export class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    firebase: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object,
    dBStatusRef: PropTypes.object.isRequired,

    children: PropTypes.object
  };

  static childContextTypes = {
    userInfoRef: PropTypes.object,
    lookupLocalized: PropTypes.func
  };

  getChildContext() {
    const lang = this.props.userInfoRef && this.props.userInfoRef.locale() || 'en';
    return {
      userInfoRef: this.props.userInfoRef,
      lookupLocalized: lookupLocalized.bind(null, lang)
    }
  }

  constructor(...args) {
    super(...args);
    this.state = {wasBusy: false};
  }

  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
  }

  componentDidMount() {
    //const { userInfoRef } = this.props;

    // TODO: Remember whether we added the logging hook already, and only add one if not done yet
    // TODO: log new visit
    // TODO: add hook to browserhistory
    // browserHistory.listen( location =>  {
      
    // });
  }

  render() {
    const { userInfoRef, dBStatusRef, signOut, children } = this.props;
    const { router } = this.context;

    //const notYetLoaded = !dBStatusRef.isLoaded;

    // if (notYetLoaded) {
    //   // still loading
    //   return (<LoadOverlay />);
    // }

    // if (!userInfoRef && router.location.pathname !== '/sign-in') {
    //   setTimeout(() => router.replace('/sign-in'), 50);
    //   return (<FAIcon name="cog" spinning={true} />);
    // }

    return (
      <div className="app container max-height">
        <Header
          signOut={signOut}
          openURL={window::open}
        />

        <main className="app-main max-height">
          { children }
        </main>
      </div>
    );
  }
}


//=====================================
//  CONNECT
//-------------------------------------

export default App;
