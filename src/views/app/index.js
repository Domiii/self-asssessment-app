import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Firebase from 'firebase';

import { firebase, helpers } from 'redux-react-firebase'
const { pathToJS } = helpers;

import { paths } from '../routes';

import Header from '../components/header';
import { FAIcon } from 'src/views/components/util';

@firebase()
@connect(
  ({firebase}) => ({
    auth: Firebase.auth().currentUser
  })
)
export class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object,
    children: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
    const { auth } = this.props;
  }

  render() {
    const { auth, firebase, children } = this.props;
    const isBusy = auth === undefined;

    const signOut = firebase.logout.bind(firebase);

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
