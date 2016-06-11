import styles from "../css/navbar.css";

import React from "react";

var NavigationBar = React.createClass({
  render: function() {
    return (
      <header id={styles.header} className="navbar navbar-default">
        <div className={"container " + styles.container}>
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".collapse.navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="close-cross"></span>
            </button>
            <a id={styles.navbarBrand} className="navbar-brand brand" title="BabbelGames">
              <img src="img/babbel.games.logo.png" height="85px" alt="BabbelGames"></img>
            </a>
          </div>
          <nav className="collapse navbar-collapse" role="navigation">
            <ul id={styles.navOptions} className="nav navbar-nav navbar-right">
              <li><a href="#">Sign-up</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">About</a></li>
            </ul>      
          </nav>
        </div>
      </header>
      );
  }
});

export default NavigationBar;
