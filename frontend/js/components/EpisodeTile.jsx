import styles from "../../css/episodeTile.css";

import React from "react";
import { Link } from "react-router";

var EpisodeTile = React.createClass({
  onMouseEnter: function() {
    this.props.onMouseEnter(this.props.src);
  },

  onMouseLeave: function() {
    this.props.onMouseLeave(this.props.src);
  },

  render() {
    var isSelected = this.props.href && this.props.srcOfMousedOverTile === this.props.src,
        src = this.props.src.replace("/", ".");

    var tile = (
        <div className={styles.eTile}
          onMouseEnter = {this.onMouseEnter}
          onMouseLeave = {this.onMouseLeave} >

          <img className={styles.eImage}
            style={{ opacity: !this.props.href ? 1 : (isSelected ? 0.2 : 0.7) }}
            src={'/img' + this.props.imageSrc} />

          <div className={styles.eTextContainer}
            style={{ visibility: isSelected ? 'visible' : 'hidden' }} >
            <div className={styles.eText}>
              {this.props.headline}
            </div>
          </div>

      </div>
    );

    if (!this.props.href) {
      return tile;
    } else {
      return <Link to={"/page/game/" + src + ".srt.json"}>
        {tile}
      </Link>
    }

  }
});

export default EpisodeTile;
