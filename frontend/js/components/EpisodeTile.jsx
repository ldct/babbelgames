import styles from "../../css/episodeTile.css";

import React from "react";
import { Link } from "react-router";

const Flag = React.createClass({
  render: function () {
    return {
      'de': <span className="flag-icon flag-icon-de"></span>,
      'fr': <span className="flag-icon flag-icon-fr"></span>,
      'pt-br': <span className="flag-icon flag-icon-br"></span>,
    }[this.props.langCode] || <span>{this.props.langCode}</span>;
  }
});

const EpisodeTile = React.createClass({
  onMouseEnter: function() {
    this.props.onMouseEnter(this.props.src);
  },

  onMouseLeave: function() {
    this.props.onMouseLeave(this.props.src);
  },

  render() {
    const isSelected = this.props.href && this.props.srcOfMousedOverTile === this.props.src;
    const src = this.props.src.replace("/", ".");

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
            <span style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              visibility: 'visible'
            }}>
              <Flag langCode={this.props.l2Code} />
            </span>
          </div>

      </div>
    );

    if (!this.props.href) {
      return tile;
    } else {
      return <Link to={this.props.href}>
        {tile}
      </Link>
    }

  }
});

export default EpisodeTile;
