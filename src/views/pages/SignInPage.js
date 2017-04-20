import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithTwitter
} from 'src/firebaseUtil';

import { firebase, helpers } from 'redux-react-firebase'
const { pathToJS } = helpers;

import { FAIcon } from 'src/views/components/util';
import { Button } from 'react-bootstrap';

export function SignIn({signInWithGithub, signInWithGoogle, signInWithTwitter}) {

  { /*
    <Button bsStyle="primary" onClick={signInWithGithub}>
      <FAIcon name="github" /> GitHub
    </Button>
    <Button bsStyle="primary" onClick={signInWithTwitter}>
      <FAIcon name="twitter" /> Twitter
    </Button>
  */ }

  return (
    <div className="g-row sign-in">
      <div className="g-col">
        <h1 className="sign-in__heading">Sign in</h1>
        <Button bsStyle="primary" onClick={signInWithGoogle}>
          <FAIcon name="google" /> Google
        </Button>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  signInWithGithub: PropTypes.func.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithTwitter: PropTypes.func.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------

export default connect(state => ({
  signInWithGithub,
  signInWithGoogle,
  signInWithTwitter
}))(SignIn);
