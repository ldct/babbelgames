import styles from "../../css/gameScreen.css";
import * as gameScreenHelper from "../utility/gameScreenHelper.jsx";

import FlippableSentence from "./FlippableSentence.jsx";

import React from "react";

// TODO: rename to GameSlab
var GameScreen = React.createClass({
  getInitialState: function() {
    return {
      matchedIds: [],
      matchedFrIdxs: [],
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

    this.props.onMatchItems(lineNumber, frJ);

    if (frenchBack === this.state.englishTiles[enI]) {

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

  componentDidMount: function() {
    var englishTiles = JSON.parse(JSON.stringify(this.props.tileData)).map(td => {
      return td[0];
    });

    window.rngSeed = this.props.rngSeed;
    gameScreenHelper.shuffle(englishTiles);

    this.setState({ englishTiles: englishTiles });
  },

  render: function() {
    var englishTiles = JSON.parse(JSON.stringify(this.props.tileData)).map(td => {
      return td[0];
    });

    window.rngSeed = this.props.rngSeed;
    gameScreenHelper.shuffle(englishTiles);

    return <div className={styles.gamescreen}>

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
              lineNumber={td[3]}
              selected={i + "-" + j === this.state.selectedFrenchIdx}
              key={j}
              displayBoth={this.state.matchedFrIdxs.indexOf(i + "-" + j) !== -1}
              onClick={displayBoth ? null : this.handleFrenchClick.bind(this, i, j)}
              back={td[1]}
              front={td[0]} />
          );
        })}
      </div>

    })}
    </div>

    <div className={styles.englishTilesArea}>{englishTiles.map((e, i) => {
      var inlineTileStyle = {
        backgroundColor: (this.state.selectedEnglishIdx === i) ? '#D58313' : 'rgba(255, 147, 0, 0.7)',
        visibility: 'visibile'
      };
      if (this.state.matchedIds.indexOf(i) !== -1) inlineTileStyle['visibility'] = 'hidden';
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

export default GameScreen;