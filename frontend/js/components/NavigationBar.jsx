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
    var desktopMode = $("#" + styles.deskTopNavOptions).is(":visible"),
        imgName = $(window).width() > 500 ? "/img/babbel.games.logo.png" : "/img/babbel.games.logo.small.png";
    return {
      clickedOnHamburger: "none",
      desktopMode: desktopMode,
      imgName: imgName
    };
  },

  // Creates a dropdown for links for both the mobile and desktop versions
  createDropDown: function(className, id, style) {
    return (
      <nav className={className} role="navigation">
        <ul id={styles[id]} className={"nav navbar-nav navbar-right " + styles.navOptions} style={style}>
          <li><a href="http://eepurl.com/b4kX5f" target="_blank">Sign Up</a></li>
          <li><a href="/auth/facebook">Log In</a></li>
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
                <img src={this.state.imgName} alt="BabbelGames"></img>
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
