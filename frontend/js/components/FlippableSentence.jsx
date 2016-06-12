import styles from "../../css/flippableSentence.css";

import React from "react";

var FlippableSentence = React.createClass({
  render: function() {
    return (
      <div className={styles.flippableSentenceContainer + " " + ((!this.props.selected && this.props.onClick) ? styles.dimOnHover : "")}
        style={{ backgroundColor: this.props.selected ? 'rgba(66, 143, 196, 1)' : 'rgba(66, 143, 196, 0.7)'} }
        onClick={this.props.onClick} >

        <div className={styles.front}
          style={{ display: this.props.displayBoth ? 'block' : 'none'}}>
          {this.props.front}
        </div>

        <div>{this.props.back}</div>
        
      </div>
    );
  }
});

export default FlippableSentence;