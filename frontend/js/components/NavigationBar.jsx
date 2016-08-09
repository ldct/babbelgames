import styles from "../../css/navigationBar.css";

import $ from "jquery";
import React from "react";
import { Router, Route, Link } from "react-router";
import { Navbar, NavItem, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


var NavigationBar = React.createClass({
  getInitialState: function() {
    return {
      clickedOnHamburger: "none",
      desktopMode: true,
      imgName: "/img/babbel.games.logo.png",
      isSmallMode: $(window).width() > 768,
    };
  },

  componentDidMount: function() {
    $(window).on("resize.navigationBar", this.resizeHandler);
    this.resizeHandler();
  },

  handleHamburgerClick: function() {
    var currentStatus = $("#" + styles.mobileNavOptions).css("display"),
        nextStatus = currentStatus === "block" ? "none" : "block";

    this.setState({clickedOnHamburger: nextStatus});
  },

  resizeHandler: function() {
    this.setState(this.retrieveState());
  },

  retrieveState: function() {
    const desktopMode = $("#" + styles.deskTopNavOptions).is(":visible");
    const imgName = $(window).width() > 768 ? "/img/babbel.games.logo.png" : "/img/babbel.games.logo.small.png";
    return {
      clickedOnHamburger: "none",
      desktopMode: desktopMode,
      imgName: imgName,
      isSmallMode: $(window).width() < 768,
    };
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

    if (isLoggedIn) return (

      <Nav pullRight>
        <NavItem href="#" style={{ padding: 0 }}>
          <img style={{
            borderRadius: '50%',
            marginTop: -20,
            marginBottom: -16,
            display: this.state.isSmallMode ? 'none' : null,
          }}
            src={window.localStorage.babbelgames_profile_image_url} />
        </NavItem>
        <NavItem href="#" onClick={this.handleLogOut}>Log Out</NavItem>
        <LinkContainer to="/page/uploadEpisodePair">
          <NavItem href="#">Upload</NavItem>
        </LinkContainer>
        <LinkContainer to="/page/about">
          <NavItem href="#">About</NavItem>
        </LinkContainer>
      </Nav>

    );
    else return (
      <Nav pullRight>
        <NavItem href="/auth/facebook">
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
          <Navbar.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Navbar.Toggle style={{ marginLeft: 0, marginRight: 0, visibility: 'hidden' }} />
            <Link to="/page/home" title="BabbelGames">
              <img style={{ padding: 0, height: '50px', margin: 'auto' }} src={this.state.imgName} alt="BabbelGames"></img>
            </Link>
          <Navbar.Toggle style={{ marginLeft: 0, marginRight: 0 }} />
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
