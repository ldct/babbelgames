import styles from "../../css/navigationBar.css";

import $ from "jquery";
import React from "react";
import { Router, Route, Link } from "react-router";
import { Navbar, NavItem, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


var NavigationBar = React.createClass({
  getInitialState: function() {
    return {
      imgName: "/img/babbel.games.logo.png",
      isSmallMode: $(window).width() > 768,
    };
  },

  componentDidMount: function() {
    $(window).on("resize.navigationBar", this.resizeHandler);
    this.resizeHandler();
  },

  resizeHandler: function() {
    const isSmallMode = $(window).width() < 768;
    const imgName = isSmallMode ? "/img/babbel.games.logo.small.png" : "/img/babbel.games.logo.png";
    this.setState({imgName: imgName, isSmallMode: isSmallMode});
  },

  handleLogOut: function () {
    window.localStorage.removeItem('babbelgames_session_token');
    window.localStorage.removeItem('babbelgames_profile_image_url');
    window.location = "/page/home";
  },

  // Creates a dropdown for links for both the mobile and desktop versions
  createDropDown: function() {
    const isLoggedIn = !!window.localStorage.babbelgames_profile_image_url;
    const loggedInStyle = {display: isLoggedIn ? "block": "none"};
    const loggedInStyleInv = {display: isLoggedIn ? "none": "block"};
    return (
      <Nav pullRight>
        <NavItem href="#" className={styles.profileImgWrapper} style={loggedInStyle}>
          <img className={styles.profileImg}
            style={{ display: this.state.isSmallMode ? 'none' : 'block' }}
            src={window.localStorage.babbelgames_profile_image_url} />
        </NavItem>
        <NavItem href="#" onClick={this.handleLogOut} style={loggedInStyle}>Log Out</NavItem>
        <LinkContainer to="/page/uploadEpisodePair" style={loggedInStyle}>
          <NavItem href="#">Upload</NavItem>
        </LinkContainer>

        <NavItem href="/auth/facebook" style={loggedInStyleInv}>
          Log In
        </NavItem>

        <LinkContainer to="/page/about">
          <NavItem href="#">About</NavItem>
        </LinkContainer>
      </Nav>

    );
  },

  render: function() {
    const isLoggedIn = !!window.localStorage.babbelgames_profile_image_url;

    return (
      <div>
        <Navbar fixedTop>
          <Navbar.Header id={styles.navbarHeader}>
            <Navbar.Toggle id={styles.navbarToggle} />
            <Link to="/page/home" title="BabbelGames">
              <img id={styles.navbarImg} src={this.state.imgName} alt="BabbelGames"></img>
            </Link>
            <Navbar.Toggle id={styles.navbarToggleVisible} />
          </Navbar.Header>
          <Navbar.Collapse>
            {this.createDropDown()}
          </Navbar.Collapse>
        </Navbar>

        {this.props.children}
      </div>
    );
  }
});

export default NavigationBar;
