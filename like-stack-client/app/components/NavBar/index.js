import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import './styles.scss';
import { useQuery } from '@apollo/client';
import GET_LOGGED_USER from '../../serverAPI/queries/GET_LOGGED_USER';
import SearchBar from '../../containers/Search';

export default ({ signOut }) => {
  let loggedUser = null;
  const { data } = useQuery(GET_LOGGED_USER);
  if (data) {
    loggedUser = data.loggedUser;
  }

  return (
    <>
      <Navbar expand="md" bg="light">
        <LinkContainer to="/home">
          <Navbar.Brand href="">Like Stack</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item>
              <LinkContainer to="/home">
                <Nav.Link href="/home">Home</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            {!loggedUser && (
              <LinkContainer to="/register">
                <Nav.Link href="/register">Sign Up</Nav.Link>
              </LinkContainer>
            )}
            {loggedUser && (
              <LinkContainer to={`/user/${loggedUser.id}`}>
                <Nav.Link href="">Personal Page</Nav.Link>
              </LinkContainer>
            )}
            {loggedUser ? (
              <>
                <LinkContainer to="/" onClick={() => signOut()}>
                  <Nav.Link className="sign-out-link" href="/">
                    Sign Out
                  </Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link href="/login">Sign In</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          <SearchBar />
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
