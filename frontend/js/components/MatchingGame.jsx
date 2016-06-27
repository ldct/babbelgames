import styles from "../../css/matchingGame.css";

import GameSlab from "./GameSlab.jsx";

import React from "react";

var MatchingGame = React.createClass({
  getInitialState: function() {
    return {
      numMatched: 0
    };
  },

  render: function() {
    const renderChunks = (chunks, i) => {

      var lineNumbers = chunks.chunk.map(s => s.lineNumber);

      var minLineNumber = Math.min.apply(null, lineNumbers);
      var maxLineNumber = Math.max.apply(null, lineNumbers);

      var matchingTileData = this.props.tileData.filter((tileData) => {
        return minLineNumber <= tileData[3] && tileData[3] <= maxLineNumber;
      });

      return (
        <GameSlab
          initialMatchedPairs={this.props.matchedPairs}
          key={i}
          sentences={chunks.chunk}
          rngSeed={chunks.rngSeed}
          tileData={matchingTileData}
          onMatchPair={(lineNumber, tileIdx) => {
            if (localStorage.babbelgames_session_token) {
              $.ajax("/progress/correctMatch", {
                data: JSON.stringify({
                  line_number: lineNumber,
                  tile_idx: tileIdx,
                  session_token: localStorage.babbelgames_session_token,
                  episode_md5: this.props.episodeMD5,
                }),
                contentType: 'application/json',
                type: 'POST',
              });
            }
          }
        } />
      );
    }

    return (
      <div>
        <div className={styles.header}>
          <div className={styles.textAlignRight}>
          </div>
          <div className={styles.imageContainer}>
            <img src={this.props.posterImageSrc}/>
            <div>
              <h1>{this.props.metadata.title}</h1>
              <h2>{this.props.metadata.subtitle}</h2>
            </div>
          </div>
        </div>
        <div className={styles.gamescreen} > <div className={styles.slightPadding}>

        Welcome to babbelgames.io. <br /> <br />

        Match the French and English phrases. Click on an English phrase (orange button) to select it, and then click on the matching French phrase (in blue).

        </div>

        </div>

        {this.props.screenplaySections.slice(0, 2).map(renderChunks)}

          <div className={styles.gamescreen}> <div className={styles.slightPadding}>
          In the coming weeks we'll add new languages, new content, and new features. Sign in to save your progress, upload your own srt files, and enjoy different game modes.

          <br /> <br />

          Want to be notified? <a className={styles.blackFont} href="http://eepurl.com/b4kX5f" target="_blank">Sign up for our mailing list now!</a>

          </div>

          </div>

        {this.props.screenplaySections.slice(2).map(renderChunks)}
        </div>

    );
  }
});

export default MatchingGame;
