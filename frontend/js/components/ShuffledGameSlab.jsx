import styles from "../../css/gameScreen.css";
import * as gameScreenHelper from "../utility/gameScreenHelper.jsx";

import FlippableSentence from "./FlippableSentence.jsx";

// import interact from "interact";
import React from "react";

// TODO: use lineNumber instead of frI in state
var ShuffledGameSlab = React.createClass({
  getInitialState: function() {
    return {
      matchedIds: this.props.initialMatchedPairs.map(frIdx => {
        var [lineNumber, frJ] = frIdx.split("-");
        [lineNumber, frJ] = [parseInt(lineNumber, 10), parseInt(frJ, 10)];

        // things with this lineNumber
        const matches = this.props.tileData.filter(td => {
          return td[3] == lineNumber;
        });
        const match = matches[frJ];

        if (match) {
          const [frenchBack, /*frenchFront*/, /*speaker*/, /*lineNumber*/] = match;
          const matchingEnglish = this.props.englishTiles.indexOf(frenchBack);
          if (matchingEnglish || matchingEnglish === 0) {
            return matchingEnglish;
          }
        }
      }),
      matchedFrIdxs: this.props.initialMatchedPairs.map(frIdx => {
        var [lineNumber, frJ] = frIdx.split("-");
        [lineNumber, frJ] = [parseInt(lineNumber, 10), parseInt(frJ, 10)];

        if (this.props.sentences[0]) {
          var frI = lineNumber - this.props.sentences[0].lineNumber;

          return(frI + "-" + frJ);
        }

      }),
      selectedEnglishIdx: null,
      selectedFrenchIdx: null,
    };
  },

  /*
  frI: index of line id
  frJ: index of flippableSentence within given line
  enI: which english tile
  */
  attemptMatch: function(frI, frJ, enI) {
    const [frenchBack, /*frenchFront*/, /*speaker*/, lineNumber] = this.props.tileData.filter(td => {
      return td[3] == this.props.sentences[frI].lineNumber;
    })[frJ];

    if (frenchBack === this.props.englishTiles[enI]) {

      this.props.onMatchPair(lineNumber, frJ);

      this.setState({
        matchedIds: this.state.matchedIds.concat(enI),
        matchedFrIdxs: this.state.matchedFrIdxs.concat(frI + '-' + frJ),
        selectedFrenchIdx: null,
        selectedEnglishIdx: null,
      });

    } else {
      this.setState({
        selectedFrenchIdx: null,
        selectedEnglishIdx: null,
      });
    }
  },

  handleEnglishClick: function(idx) {
    const frenchWasSelected = this.state.selectedFrenchIdx !== null;
    const englishWasSelected = this.state.selectedEnglishIdx !== null;

    if (!frenchWasSelected && !englishWasSelected) {
      this.setState({ selectedEnglishIdx: idx });
    }
    if (!frenchWasSelected && englishWasSelected) {
      this.setState({ selectedEnglishIdx: null });
    }
    if (frenchWasSelected && !englishWasSelected) {
      const [i, j] = this.state.selectedFrenchIdx.split('-');
      this.attemptMatch(parseInt(i, 10), parseInt(j, 10), idx);
    }
    if (frenchWasSelected && englishWasSelected) {
      console.log('assertion failed');
    }

  },

  handleFrenchClick: function(i, j) {
    const frenchWasSelected = this.state.selectedFrenchIdx !== null;
    const englishWasSelected = this.state.selectedEnglishIdx !== null;

    if (!frenchWasSelected && !englishWasSelected) {
      this.setState({ selectedFrenchIdx: i + '-' + j });
    }

    if (!frenchWasSelected && englishWasSelected) {
      this.attemptMatch(i, j, this.state.selectedEnglishIdx);
    }

    if (frenchWasSelected && !englishWasSelected) {
      this.setState({ selectedFrenchIdx: null });
    }

    if (frenchWasSelected && englishWasSelected) {
      console.log('assertion failed');
    }
  },

  render: function() {

    return <div className={styles.gamescreen}>

    <div>
    {window.debugMode ? JSON.stringify(this.props.controlPressed): null}
    </div>

    <div className={styles.transcriptArea}>

    {this.props.sentences.map((sentence, i) => {

      if (sentence.line.length === 0) return null;

      var matchingTileData = this.props.tileData.filter(td => {
        return td[3] == sentence.lineNumber;
      });

      if (matchingTileData.length === 0) {
        var colonIndex = sentence.line.indexOf(':') === -1,
            classStr = colonIndex ? styles.lineBlock + " " + styles.italic : styles.lineBlock;
        if(sentence.line === '\r') return null;
        return (
          <div className={classStr} key={i} >
            {sentence.line}
          </div>
        );
      }

      var speakerName = sentence.line.split(":")[0];

      return <div className={styles.lineBlock} key={i}>
        <span className={styles.right} key={i}>{speakerName}</span>
        {matchingTileData.map((td, j) => {
          const displayBoth = this.state.matchedFrIdxs.indexOf(i + "-" + j) !== -1;
          return (
            <FlippableSentence
              controlPressed={this.props.controlPressed}
              lineNumber={td[3]}
              selected={i + "-" + j === this.state.selectedFrenchIdx}
              key={j}
              displayBoth={displayBoth}
              onClick={displayBoth ? null : this.handleFrenchClick.bind(this, i, j)}
              back={td[1]}
              front={td[0]} />
          );
        })}
      </div>

    })}
    </div>

    <div className={styles.englishTilesArea}>{this.props.englishTiles.map((e, i) => {
      var inlineTileStyle = {
        backgroundColor: (this.state.selectedEnglishIdx === i) ? '#D58313' : 'rgba(255, 147, 0, 0.7)',
        visibility: (this.state.matchedIds.indexOf(i) !== -1) ? 'hidden' : 'visible'
      };
      return (
        <div className={styles.tileStyle + " " + (this.state.selectedEnglishIdx === i ? "" : styles.dimOnHover) }
          style={inlineTileStyle}
          key={i}
          onClick={this.handleEnglishClick.bind(this, i)} >
            {e}
        </div>
      );
    })}</div>
    </div>
  }
});

export default ShuffledGameSlab;
