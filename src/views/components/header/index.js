import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Button
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';

import { FAIcon } from 'src/views/components/util';

export default class Header extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    userInfo: PropTypes.object
  };

  static propTypes = {
    openURL: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  };

  render() {
    const { router, userInfo } = this.context;
    const { openURL, signOut } = this.props;

    const busy = !userInfo || !userInfo.isLoaded;
    const user = userInfo && userInfo.props.auth;
    const lang = userInfo.locale();

    // actions
    const gotoProfile = () => router.replace('/user');
    const switchToEn = () => userInfo.set_locale('en');
    const switchToZh = () => userInfo.set_locale('zh');

    // elements
    const profileEl = (user && 
      <MenuItem eventKey="user-drop-profile" onClick={gotoProfile}>
        <span>
          <FAIcon name="user" /> {user.displayName || user.email}
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
            {/*<Nav>
              
            </Nav>*/ }
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem>
                <Button active={lang === 'en'} onClick={switchToEn} bsSize="small">
                EN</Button>
                <Button active={lang === 'zh'} onClick={switchToZh} bsSize="small">
                中文</Button>
              </NavItem>
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
