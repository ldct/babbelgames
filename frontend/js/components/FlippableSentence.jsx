import styles from "../../css/flippableSentence.css";

import React from "react";

const DefinableWord = React.createClass({
  handleMouseEnter: function () {
    this.props.onMouseEnter(this.props.idx);
  },
  handleMouseLeave: function () {
    this.props.onMouseLeave(this.props.idx);
  },
  render: function () {
    return (
      <span
        style={{
          border: (this.props.active ? '1px solid pink' : '1px solid transparent'),
          marginRight: '0.2em',
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.word}
      </span>
    )
  }
});

const FlippableSentence = React.createClass({

  getInitialState: function () {
    return {
      mousedOverWordIdx: null,
    }
  },

  handleMouseEnter: function (idx) {
    this.setState({
      mousedOverWordIdx: idx,
    });
  },

  handleMouseLeave: function (idx) {
    if (this.state.mousedOverWordIdx === idx) {
      this.setState({
        mousedOverWordIdx: null,
      });
    }
  },

  render: function() {
    return (
      <div className={styles.flippableSentenceContainer + " " + ((!this.props.selected && this.props.onClick) ? styles.dimOnHover : "")}
        style={{
          backgroundColor: this.props.selected ? 'rgba(66, 143, 196, 1)' : 'rgba(66, 143, 196, 0.7)',
          border: '1px solid pink',
        }}
        onClick={this.props.onClick} >

        <div
          className={styles.front}
          style={{ display: this.props.displayBoth ? 'block' : 'none'}}
        >
          {this.props.front}
        </div>

        <div>
          {this.props.back.split(' ').map((word, i) =>
            <DefinableWord
              word={word}
              idx={i}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              active={this.props.controlPressed && this.state.mousedOverWordIdx === i}
            />
          )}
        </div>

      </div>
    );
  }
});

export default FlippableSentence;