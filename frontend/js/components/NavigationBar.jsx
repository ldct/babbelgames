import styles from "../../css/navigationBar.css";

import React from "react";

var NavigationBar = React.createClass({
  componentDidMount: function() {
    var location = this.props.location.pathname,
        newLocation = location === "/" ? "/page/home" : location;
    
    console.log(location + " " + newLocation);
    this.props.history.push(newLocation);    
  },

  returnToHomePage: function() {
    this.props.history.push("/page/home");
  },

  render: function() {
    return (
      <div>
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
                <img src="/img/babbel.games.logo.png" onClick={this.returnToHomePage} alt="BabbelGames"></img>
              </a>
            </div>
            <nav className="collapse navbar-collapse" role="navigation">
              <ul id={styles.navOptions} className="nav navbar-nav navbar-right">
                <li><a href="http://eepurl.com/b4kX5f" target="_blank">Sign-up</a></li>
                <li><a href="mailto:xuanji@gmail.com">Contact</a></li>
                <li><a href="#">About</a></li>
              </ul>      
            </nav>
          </div>
        </header>
        {this.props.children}
      </div>
    );
  }
});

export default NavigationBar;
