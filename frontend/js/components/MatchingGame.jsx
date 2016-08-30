import styles from "../../css/matchingGame.css";
import GameSlab from "./GameSlab.jsx";
import FlippableSentence from "./FlippableSentence.jsx";
import React from "react";
import $ from "jquery";

const MatchingGame = React.createClass({

  handleKeyUp: function (evt) {
    this.setState({
      controlPressed: false,
    });
  },

  handleKeyDown: function (evt) {
    if (evt.keyCode === 17 || evt.keyCode === 91) {
      this.setState({
        controlPressed: true,
      });
    }
  },

  componentDidMount: function () {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  },

  getInitialState: function() {
    return {
      numMatched: 0,
      showAll: false,
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
          controlPressed={this.state.controlPressed}
          onMatchPair={(lineNumber, tileIdx) => {
            if (localStorage.babbelgames_session_token && this.props.episodeMD5) {
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

    const l2Name = {
      'de': 'German',
      'fr': 'French',
      'pt-br': 'Portuguese'
    }[this.props.metadata.l2_code];

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
        <div className={styles.gamescreen}> <div className={styles.slightPadding}>

        Welcome to babbelgames.io. <br /> <br />

        Match the {l2Name} and English phrases. Click on an English phrase (orange button) to select it, and then click on the matching {l2Name} phrase (in blue).

        </div>

        </div>

        {this.state.showAll
          ? this.props.screenplaySections.map(renderChunks)
          : this.props.screenplaySections.slice(0, 10).map(renderChunks)
        }

        {this.state.showAll
          ? null
          : <div className={styles.gamescreen}> <div className={styles.slightPadding}>
            <FlippableSentence
              controlPressed={false}
              selected={false}
              displayBoth={false}
              onClick={() => {this.setState({showAll: true})}}
              back={"Click to Show All"}
              front={""} />
            </div>
            </div>
        }



        </div>

    );
  }
});

export default MatchingGame;
