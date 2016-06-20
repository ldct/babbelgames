import styles from "../../css/navigationBar.css";

import $ from "jquery";
import React from "react";

var NavigationBar = React.createClass({
  getInitialState: function() {
    return {
      clickedOnCross: "none",
      desktopMode: true,
      imgName: "/img/babbel.games.logo.png"
    };
  },

  componentDidMount: function() {
    var location = this.props.location.pathname,
        newLocation = location === "/" ? "/page/home" : location;

    console.log(location + " " + newLocation);
    this.props.history.push(newLocation);

    $(window).on("resize.navigationBar", this.resizeHandler);
    this.resizeHandler();
  },

  returnToHomePage: function(e) {
    this.props.history.push("/page/home");
  },

  goToAboutPage: function (e) {
    this.props.history.push("/page/about");
  },

  handleClick: function() {
    var currentStatus = $("#" + styles.mobileNavOptions).css("display"),
        nextStatus = currentStatus === "block" ? "none" : "block";

    this.setState({clickedOnCross: nextStatus});
  },

  resizeHandler: function() {
    this.setState(this.retrieveState());
  },

  retrieveState: function() {
    var desktopMode = $("#" + styles.deskTopNavOptions).is(":visible"),
        imgName = $(window).width() > 500 ? "/img/babbel.games.logo.png" : "/img/babbel.games.logo.small.png";
    return {
      clickedOnCross: "none",
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
          <li><a onClick={this.goToAboutPage}>About</a></li>
        </ul>
      </nav>
    );
  },

  returnToHomePage: function() {
    this.props.history.push("/page/home");
  },

  render: function() {
    return (
      <div>
        <header id={styles.header} className="navbar navbar-default">
          <div className={"container " + styles.container}>
            <div className={"navbar-header " + styles.topHeader}>
              <button type="button" className="navbar-toggle collapsed" id={styles.dropdownButton}
                onClick={this.handleClick}
                style={{display: (this.state.desktopMode ? "none" : "block") }}
                data-toggle="collapse" data-target=".collapse.navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="close-cross"></span>
              </button>
              <a id={styles.navbarBrand} className="navbar-brand brand" title="BabbelGames">
                <img src={this.state.imgName} onClick={this.returnToHomePage} alt="BabbelGames"></img>
              </a>
            </div>
            {this.createDropDown("", "deskTopNavOptions", {})}
            {this.createDropDown("collapse navbar-collapse", "mobileNavOptions", {display: this.state.clickedOnCross})}
          </div>
        </header>
        {this.props.children}
      </div>
    );
  }
});

export default NavigationBar;
