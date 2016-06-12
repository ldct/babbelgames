import styles from "../css/episodeTile.css";

import React from "react";

var EpisodeTile = React.createClass({
  onMouseEnter: function() {
    this.props.onMouseEnter(this.props.src);
  },

  onMouseLeave: function() {
    this.props.onMouseLeave(this.props.src);
  },

  render() {
    var isSelected = !this.props.isPoster && this.props.srcOfMousedOverTile === this.props.src;
    var tile = (
        <div className={styles.eTile} 
          onMouseEnter = {this.onMouseEnter}
          onMouseLeave = {this.onMouseLeave} >

          <img className={styles.eImage}
            style={{ opacity: this.props.isPoster ? 1 : (isSelected ? 0.2 : 0.7) }}
            src={'/img/' + this.props.src.replace('/', '.') + '.jpg'} />

          <div className={styles.eTextContainer}
            style={{ visibility: isSelected ? 'visible' : 'hidden' }} >
            <div className={styles.eText}>
              {this.props.headline}
            </div>
          </div>
          
        </div>
      )

    if (this.props.isPoster) {
      return tile;
    } else {
      return (
        <a href={"/screenplayGame.html?src=" + this.props.src + '.srt.json'}>
          {tile}
        </a>
      );
    }

  }
});

export default EpisodeTile;
