import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'redux';
import autoBind from 'react-autobind';
import { Link } from 'react-router';

import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, ButtonGroup, Alert
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';

import { FAIcon } from 'src/views/components/util';

export default class Header extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object
  };

  static propTypes = {
    signOut: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }


  gotoProfile() {
    const { router } = this.context;
    router.replace('/user');
  }

  gotoSubmissions(evt) {
    this.openInNewTab(evt, '/submissions');
  }

  gotoGit(evt) {
    this.openInNewTab(evt, 'https://github.com/Domiii/self-asssessment-app');
  }

  gotoScratch3Sandbox(evt) {
    this.openInNewTab(evt, 'http://codepen.io/Domiii/pen/JbvLbe');
  }

  openInNewTab(evt, url) {
    evt.preventDefault();
    window.open(url,'_blank');
  }

  switchToEn() {
    const { userInfoRef } = this.context;
    userInfoRef.set_locale('en');
  }

  switchToZh() {
    const { userInfoRef } = this.context;
    userInfoRef.set_locale('zh');
  }

  toggleAdminView() {
    const { userInfoRef } = this.context;
    userInfoRef.set_adminDisplayMode(!userInfoRef.adminDisplayMode());
  }

  render() {
    //console.log('header');
    const { router, userInfoRef } = this.context;
    const { signOut } = this.props;

    const isAdminView = userInfoRef && userInfoRef.adminDisplayMode();
    const isLoading = !userInfoRef || !userInfoRef.isLoaded;
    const user = userInfoRef && userInfoRef.val;
    const userData = userInfoRef && userInfoRef.data();
    const lang = userInfoRef && userInfoRef.locale() || 'en';

    // elements
    const adminToolsEL = (!user || !user.isAdmin) ? null : (
      <NavItem className='header-right'>
        <Button onClick={this.toggleAdminView} bsStyle={isAdminView && 'success' || 'danger'}
          className="header-gavel-button"
          active={isAdminView}>
          <FAIcon name="gavel"/>
        </Button>
        <span className="padding-half" />
      </NavItem>
    );

    const userToolsEl = !user ? null : (
      <NavItem className='header-right'>
        <ButtonGroup>
          <Button active={lang === 'en'} onClick={this.switchToEn} bsSize="small">
            EN
          </Button>
          <Button active={lang === 'zh'} onClick={this.switchToZh} bsSize="small">
            中文
          </Button>
        </ButtonGroup>
      </NavItem>
    );

    const profileEl = (userData && 
      <MenuItem eventKey="user-drop-profile" onClick={this.gotoProfile}>
        <span>
          {
            userData.photoURL &&
            <img src={userData.photoURL} style={{width: '2em'}} /> ||
            <FAIcon name="user" />
          }
          <span className="padding-half" />
          {userData.displayName || userData.email}
        </span>
      </MenuItem>
    );

    let warningEl;

    if (router.location.pathname === '/submissions') {
      warningEl = (
        <Alert bsStyle="danger">
          This page suffers from data inconsistency when clicking buttons/links.
          Open links in new window instead.
        </Alert>
      );
    }

    return (<div>
      { warningEl }
      <header className="header">
        <Navbar inverse collapseOnSelect className="no-margin">
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/' onlyActiveOnIndex={true}><span>Home</span></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            {isAdminView &&
              <Nav> 
                <LinkContainer to='/notifications'>
                  <NavItem eventKey={1}>Notifications</NavItem>
                </LinkContainer>
                <LinkContainer to='/submissions' onClick={ this.gotoSubmissions }>
                  <NavItem eventKey={1}>Submissions</NavItem>
                </LinkContainer>
              </Nav>
            }
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight className="header-right-container">
              { adminToolsEL }
              { userToolsEl }
              <NavDropdown eventKey="more-drop" id="user-dropdown" title={
                   <FAIcon name="cog" />
                }>
                { profileEl }
                { user && <MenuItem divider /> }
                <MenuItem eventKey="more-drop-sand" onClick={ this.gotoGit }>
                 <FAIcon name="github" /> View Source Code
                </MenuItem>
                <MenuItem eventKey="more-drop-sand" onClick={ this.gotoScratch3Sandbox }>
                  Scratch 3.0 Sandbox
                </MenuItem>  
                { user && <MenuItem divider /> }
                { user && (
                  <MenuItem eventKey="user-drop-logout" onClick={signOut}>
                    <FAIcon name="close" className="color-red" /> Sign Out
                  </MenuItem>)
                }
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </div>);
  }
};
