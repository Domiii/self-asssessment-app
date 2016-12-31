import { UserInfo } from 'src/core/user-info';
import { makeGetDataDefault } from 'src/util/firebaseUtil';
import { paths } from '../routes';
import { isInitialized } from 'src/util/firebaseUtil';
import { createSelector } from 'reselect';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { firebase, helpers } from 'redux-react-firebase'
import Header from '../components/header';
import { FAIcon } from 'src/views/components/util';

const { pathToJS } = helpers;

@firebase((props, firebase) => {
  const uid = firebase._.authUid;
  const paths = [];
  if (uid) {
    paths.push(UserInfo.userPath(uid));
  }
  return paths;
})
@connect(
  ({ firebase }) => {
    const auth = pathToJS(firebase, 'auth');
    const props = {
      auth
    };

    if (auth && auth.uid) {
      const getData = makeGetDataDefault(firebase);
      props.userInfo = new UserInfo(getData, auth);


      //console.log(props.userInfo.rootData);
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
    auth: PropTypes.object,
    userInfo: PropTypes.instanceOf(UserInfo),

    children: PropTypes.object
  };

  static childContextTypes = {
    userInfo: PropTypes.instanceOf(UserInfo)
  };

  getChildContext() {
    return {
      userInfo: this.props.userInfo
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
    const { auth, firebase, children } = this.props;
    const { router } = this.context;
    const isBusy = auth === undefined;

    if (!children) {
      router.replace('/');
      return;
    }

    const signOut = firebase.logout.bind(firebase);

    if (isBusy) {
      // still loading
      return (<FAIcon name="cog" spinning={true} />);
    }
    
    const mainEl = isBusy ? 
      <FAIcon name="cog" spinning={true} /> : (
      <main className="app-main">
        { React.cloneElement(children, { auth } ) }
      </main>
    );

    return (
      <div className="app container">
        <Header
          auth={this.props.auth}
          signOut={signOut}
          openURL={window::open}
        />

        { mainEl }
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
