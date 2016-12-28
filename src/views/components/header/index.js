import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';

import { FAIcon } from 'src/views/components/util';


export default class Header extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    openURL: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  };

  render() {
    const { auth, openURL, signOut } = this.props;

    return (
      <header className="header">
        <Navbar inverse collapseOnSelect>
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
              <NavDropdown eventKey="more-drop" id="user-dropdown" title="more">
                <MenuItem eventKey="more-drop-sand" onClick={() => openURL('https://github.com/Domiii/self-asssessment-app')}>
                  View Source Code <i className="fa fa-github" aria-hidden="true"></i>
                </MenuItem>
                <MenuItem eventKey="more-drop-sand" onClick={() => openURL('http://codepen.io/Domiii/pen/JbvLbe')}>
                  Scratch 3.0 Sandbox
                </MenuItem>
              </NavDropdown>
              {!!auth ?
                <NavDropdown eventKey="user-drop" id="user-dropdown"
                  title={<span><FAIcon name="user" /> {auth.displayName || auth.email}</span>}>
                  <MenuItem divider />
                  <MenuItem eventKey="user-drop-logout" onClick={signOut}>Sign Out</MenuItem>
                </NavDropdown>
               : <LinkContainer to={{ pathname: '/sign-in' }} onlyActiveOnIndex={true}><span>Login</span></LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
};
