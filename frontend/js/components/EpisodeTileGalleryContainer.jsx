import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, Redirect} from "react-router";
import { browserHistory } from 'react-router';
import EpisodeTile from "./EpisodeTile.jsx";
import styles from "../../css/episodeTileGallery.css";

// TODO: separate container from actual thing
const EpisodeTileGalleryContainer = React.createClass({
  getInitialState: function () {
    return {
      episodePairs: [],
      srcOfMousedOverTile: null,
    };
  },
  handleMouseOverTile: function(src) {
    this.setState({ srcOfMousedOverTile: src });
  },

  handleMouseOutTile: function(src) {
    if (this.state.srcOfMousedOverTile === src) {
      this.setState({ srcOfMousedOverTile: null });
    }
  },
  componentDidMount: function () {
    $.getJSON('/episode_pairs.json', (res) => {
      this.setState({
        'episodePairs': res
      });
    });
  },
  render: function () {

    return <div className={styles.flexContainer}>
      <div className={styles.episodeTileContainer}>
        {this.state.episodePairs.map((ep, i) => <EpisodeTile
          key={i}
          src={ep.uid}
          imageSrc={'/' + ep.episode_poster_filename}
          onMouseEnter={this.handleMouseOverTile}
          onMouseLeave={this.handleMouseOutTile}
          isPoster={false}
          headline={ep.episode_title}
          href={"/page/game/" + ep.uid + ".srt.json"}
          srcOfMousedOverTile={this.state.srcOfMousedOverTile} />
        )}
      </div>
      <div className={styles.additionalInfoFooter}>
        <div>Copyright &copy; 2016 BabbelGames</div>
      </div>
    </div>

    return <div></div>
  }
});

export default EpisodeTileGalleryContainer;
