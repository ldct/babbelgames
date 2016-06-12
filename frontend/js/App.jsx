import styles from "../css/app.css";

import EpisodeTile from "./EpisodeTile.jsx";
import NavigationBar from "./NavigationBar.jsx";

import sendGoogleAnalytics from "./googleAnalytics.jsx";

import React from "react";
import ReactDOM from 'react-dom';

var App = React.createClass({
  getInitialState: function() {
    return {
      srcOfMousedOverTile: null,
    }
  },

  handleMouseOverTile: function(src) {
    this.setState({ srcOfMousedOverTile: src });
  },

  handleMouseOutTile: function(src) {
    if (this.state.srcOfMousedOverTile === src) {
      this.setState({ srcOfMousedOverTile: null });
    }
  },

  render: function() {
    var mo = this.handleMouseOverTile,
        ml = this.handleMouseOutTile;
    return (
      <div className={styles.flexContainer}>
        <div className={styles.episodeTileContainer}>
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends.poster" isPoster={true} />
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends/s01e01" headline="The One Where Monica Gets a Roommate"/>
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends/s01e02" headline="The One With the Sonogram at the End"/>
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends/s01e03" headline="The One With the Thumb"/>
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="sherlock.poster" isPoster={true} />
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="sherlock/s01e01" headline="A Study in Pink" />
          <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="sherlock/s01e02" headline="The Blind Banker" />
        </div>
        <div className={styles.additionalInfoFooter}>
          <div>Copyright &copy; 2016 BabbelGames</div>
        </div>
      </div>
    );
  }
});

sendGoogleAnalytics();
ReactDOM.render(
  <div>
    <NavigationBar />
    <App />
  </div>,
  document.getElementById('container')
);