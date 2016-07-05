import styles from "../../css/episodeTileGallery.css";

import EpisodeTile from "./EpisodeTile.jsx";

import React from "react";

var EpisodeTileGallery = React.createClass({
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

  convertToTiles: function(arrObject) {
    var mo = this.handleMouseOverTile,
        ml = this.handleMouseOutTile;

    return arrObject.map((object, i) => {
      return (
        <EpisodeTile
          key={i}
          onMouseEnter={mo}
          onMouseLeave={ml}
          src={object.src}
          imageSrc={'/' + object.src.replace('/', '.') + '.jpg'}
          isPoster={object.isPoster}
          headline={object.headline}
          srcOfMousedOverTile={this.state.srcOfMousedOverTile} />
      );
    });
  },

  render: function() {
    var episodeTiles = this.convertToTiles(this.props.route.episodes);
    return (
      <div className={styles.flexContainer}>
        <div className={styles.episodeTileContainer}>
          {episodeTiles}
        </div>
        <div className={styles.additionalInfoFooter}>
          <div>Copyright &copy; 2016 BabbelGames</div>
        </div>
      </div>
    );
  }
});

export default EpisodeTileGallery;
