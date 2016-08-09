import styles from "../../css/navigationBar.css";

import $ from "jquery";
import React from "react";
import {Router, Route, Link} from "react-router";

var NavigationBar = React.createClass({
  getInitialState: function() {
    return {
      clickedOnHamburger: "none",
      desktopMode: true,
      imgName: "/img/babbel.games.logo.png"
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
    const imgName = $(window).width() > 500 ? "/img/babbel.games.logo.png" : "/img/babbel.games.logo.small.png";
    return {
      clickedOnHamburger: "none",
      desktopMode: desktopMode,
      imgName: imgName
    };
  },

  handleLogOut: function () {
    window.localStorage.removeItem('babbelgames_session_token');
    window.localStorage.removeItem('babbelgames_profile_image_url');
    window.location = "/page/home";
  },

  // Creates a dropdown for links for both the mobile and desktop versions
  createDropDown: function(className, id, style) {
    const isLoggedIn = !!window.localStorage.babbelgames_profile_image_url;
    const loggedInStyle = {display: isLoggedIn ? "block": "none"};
    const loggedInStyleInv = {display: isLoggedIn ? "none": "block"};

    return (
      <nav className={className} role="navigation">
        <ul id={styles[id]} className={"nav navbar-nav navbar-right " + styles.navOptions} style={style}>
          <li style={loggedInStyle}>
            <img style={{ borderRadius: '50%' }}
              src={window.localStorage.babbelgames_profile_image_url} />
          </li>

          <li style={loggedInStyle}>
            <a href="#" onClick={this.handleLogOut} >Log Out</a>
          </li>

          <li style={loggedInStyle}>
            <Link to="/page/uploadEpisodePair">Upload</Link>
          </li>

          <li style={loggedInStyleInv}>
            <a href="/auth/facebook">Log In</a>
          </li>
          <li><Link to="/page/about">About</Link></li>
        </ul>
      </nav>
    );

  },

  render: function() {
    return (
      <div>
        <header id={styles.header} className="navbar navbar-default">
          <div className={"container " + styles.container}>
            <div className={"navbar-header " + styles.topHeader}>
              <button type="button" className="navbar-toggle collapsed" id={styles.dropdownButton}
                onClick={this.handleHamburgerClick}
                style={{display: (this.state.desktopMode ? "none" : "block") }}
                data-toggle="collapse" data-target=".collapse.navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="close-cross"></span>
              </button>
              <Link to="/page/home" id={styles.navbarBrand} className="navbar-brand brand" title="BabbelGames">
                <img style={{ height: 50, }} src={this.state.imgName} alt="BabbelGames"></img>
              </Link>
            </div>
            {this.createDropDown("", "deskTopNavOptions", {})}
            {this.createDropDown("collapse navbar-collapse", "mobileNavOptions", {display: this.state.clickedOnHamburger})}
          </div>
        </header>
        {this.props.children}
      </div>
    );
  }
});

export default NavigationBar;
