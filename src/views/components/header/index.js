import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem
} from 'react-bootstrap';

const Header = ({currentUser, signOut, openURL}) => {
  return (
    <header className="header">
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" onlyActiveOnIndex={true}>Home</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} onClick={() => openURL('https://github.com/Domiii/self-asssessment-app')}>
              View Source Code <i className="fa fa-github" aria-hidden="true"></i>
            </NavItem>
            <NavItem eventKey={2} onClick={() => openURL('http://codepen.io/Domiii/pen/JbvLbe')}>
              Scratch 3.0 Sandbox
            </NavItem>
          </Nav>
          <Nav pullRight>
            {currentUser.authenticated ?
              <NavDropdown eventKey="user-drop" title={currentUser.displayName || currentUser.email} id="nav-dropdown">
                <MenuItem divider />
                <MenuItem eventKey="user-drop-logout" onClick={signOut}>Sign Out</MenuItem>
              </NavDropdown>
             : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

Header.propTypes = {
  currentUser: PropTypes.object.isRequired,
  openURL: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
};

export default Header;
