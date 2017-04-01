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

const { pathToJS } = helpers;

@firebase((props, firebase) => {
  const uid = firebase._.authUid;
  const paths = [];
  if (uid) {
    paths.push(UserInfoRef.user.makeQuery({uid}));
  }
  return paths;
})
@connect(
  ({ firebase }) => {
    const auth = pathToJS(firebase, 'auth');
    const props = {};

    if (auth && auth.uid) {
      props.userInfo = UserInfoRef.user(firebase, {auth, uid: auth.uid});


      //console.log(props.userInfo.val);
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
    userInfo: PropTypes.object,

    children: PropTypes.object
  };

  static childContextTypes = {
    userInfo: PropTypes.object,
    lookupLocalized: PropTypes.func
  };

  getChildContext() {
    const lang = this.props.userInfo && this.props.userInfo.locale() || 'en';
    return {
      userInfo: this.props.userInfo,
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
    const { userInfo, firebase, children } = this.props;
    const { router } = this.context;
    const isBusy = userInfo && !userInfo.isLoaded;

    if (!children) {
      router.replace('/');
      return (<FAIcon name="cog" spinning={true} className="color-gray" />);
    }

    const signOut = () => {
      try {
        firebase.logout();
      }
      catch (err) {
        console.error(err.stack);
      }
    };

    if (!userInfo && router.location.pathname !== '/sign-in') {
      setTimeout(() => router.replace('/sign-in'), 50);
      return (<FAIcon name="cog" spinning={true} />);
    }

    if (isBusy) {
      // still loading
      return (<div className="overlay">
        <div style={{fontSize: '1.5em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', /* horizontal */
          alignItems: 'center'}}
          className="max-height color-gray">
          <p>loading...</p>
          <p>
            <FAIcon name="cog" spinning={true}/>
          </p>
        </div>
      </div>);
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
