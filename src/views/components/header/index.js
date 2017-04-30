import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, ButtonGroup
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';

import { FAIcon } from 'src/views/components/util';

export default class Header extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfoRef: PropTypes.object
  };

  static propTypes = {
    openURL: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  };

  render() {
    const { router, userInfoRef } = this.context;
    const { openURL, signOut } = this.props;

    const isLoading = !userInfoRef || !userInfoRef.isLoaded;
    const user = userInfoRef && userInfoRef.val;
    const userData = userInfoRef && userInfoRef.data();
    const lang = userInfoRef && userInfoRef.locale() || 'en';

    // actions
    const gotoProfile = () => router.replace('/user');
    const switchToEn = () => userInfoRef.set_locale('en');
    const switchToZh = () => userInfoRef.set_locale('zh');
    const toggleAdminView = () => userInfoRef.set_adminDisplayMode(!userInfoRef.adminDisplayMode());

    // elements
    const adminToolsEL = (!user || !user.isAdmin) ? null : (
      <NavItem className='header-right'>
        <Button onClick={toggleAdminView} bsStyle={userInfoRef.adminDisplayMode() && 'success' || 'danger'}
          className="header-gavel-button"
          active={userInfoRef.adminDisplayMode()}>
          <FAIcon name="gavel"/>
        </Button>
        <span className="padding-half" />
      </NavItem>
    );

    const userToolsEl = !user ? null : (
      <NavItem className='header-right'>
        <ButtonGroup>
          <Button active={lang === 'en'} onClick={switchToEn} bsSize="small">
            EN
          </Button>
          <Button active={lang === 'zh'} onClick={switchToZh} bsSize="small">
            中文
          </Button>
        </ButtonGroup>
      </NavItem>
    );

    const profileEl = (userData && 
      <MenuItem eventKey="user-drop-profile" onClick={gotoProfile}>
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

    return (
      <header className="header">
        <Navbar inverse collapseOnSelect className="no-margin">
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/' onlyActiveOnIndex={true}><span>Home</span></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Nav>
              <LinkContainer to='/notifications'>
                <NavItem eventKey={1}>Notifications</NavItem>
              </LinkContainer>
            </Nav>
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
                <MenuItem eventKey="more-drop-sand" onClick={() => openURL('https://github.com/Domiii/self-asssessment-app')}>
                 <FAIcon name="github" /> View Source Code
                </MenuItem>
                <MenuItem eventKey="more-drop-sand" onClick={() => openURL('http://codepen.io/Domiii/pen/JbvLbe')}>
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
    );
  }
};
