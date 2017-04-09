import DBStatusRef from 'src/core/DBStatusRef';
import { UserInfoRef } from 'src/core/users';
import { isInitialized } from 'src/util/firebaseUtil';
import { createSelector } from 'reselect';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { firebase, helpers } from 'redux-react-firebase'
import Header from './components/header';
import { FAIcon } from 'src/views/components/util';
import { lookupLocalized } from 'src/util/localizeUtil';

import { LoadOverlay } from 'src/views/components/overlays';

const { pathToJS } = helpers;

@firebase((props, Firebase) => {
  const uid = Firebase._.authUid;
  const paths = [
    DBStatusRef.makeQuery()
  ];
  if (uid) {
    paths.push(UserInfoRef.user.makeQuery({uid}));
  }
  return paths;
})
@connect(
  ({ firebase }, ownProps) => {
    const auth = pathToJS(firebase, 'auth');
    const dBStatusRef = DBStatusRef(firebase);

    const props = {
      dBStatusRef,
      clientVersion: dBStatusRef.version()
    };

    if (auth && auth.uid) {
      props.userInfoRef = UserInfoRef.user(firebase, {auth, uid: auth.uid});

      if (props.userInfoRef.isLoaded && !props.userInfoRef.val) {
        // see: https://firebase.google.com/docs/reference/js/firebase.UserInfo
        const userData = auth.providerData && auth.providerData.length && auth.providerData[0];
        if (userData) {
          props.userInfoRef.setUserData(userData);
        }
      }
      //console.log(props.userInfoRef.val);
    }

    return props;
  }
)
export class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    firebase: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object.isRequired,
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

  render() {
    const { userInfoRef, dBStatusRef, firebase, children } = this.props;
    const { router } = this.context;
    const isStillLoading = userInfoRef && (!userInfoRef.val);

    const signOut = () => {
      try {
        firebase.logout();
      }
      catch (err) {
        console.error(err.stack);
      }
    };

    if (!userInfoRef && router.location.pathname !== '/sign-in') {
      setTimeout(() => router.replace('/sign-in'), 50);
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (isStillLoading) {
      // still loading
      return (<LoadOverlay />);
    }

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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
