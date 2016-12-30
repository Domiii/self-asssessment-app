import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Firebase from 'firebase';

import { firebase, helpers } from 'redux-react-firebase'
const { pathToJS } = helpers;

import { paths } from '../routes';

import Header from '../components/header';
import { FAIcon } from 'src/views/components/util';
import { isInitialized } from 'src/util/firebaseUtil';


@firebase()
@connect(
  ({firebase}) => ({
    auth: pathToJS(firebase, 'auth')
  })
)
export class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object,
    children: PropTypes.object,
    firebase: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = {wasBusy: false};
  }

  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
    const { auth } = this.props;
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
