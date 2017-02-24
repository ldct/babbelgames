import * as gameScreenHelper from "../utility/gameScreenHelper.jsx";
import styles from "../../css/matchingGame.css";
import GameSlab from "./GameSlab.jsx";
import FlippableSentence from "./FlippableSentence.jsx";
import React from "react";
import $ from "jquery";


// TODO: document this stuff
const renderChunksFull = (state, tileData, matchedPairs, epsiodeMD5, chunks, i) => {

  var lineNumbers = chunks.chunk.map(s => s.lineNumber);

  var minLineNumber = Math.min.apply(null, lineNumbers);
  var maxLineNumber = Math.max.apply(null, lineNumbers);

  var matchingTileData = tileData.filter((tileData) => {
    return minLineNumber <= tileData[3] && tileData[3] <= maxLineNumber;
  });

  return (
    <GameSlab
      initialMatchedPairs={matchedPairs}
      key={i}
      sentences={chunks.chunk}
      rngSeed={chunks.rngSeed}
      tileData={matchingTileData}
      controlPressed={false}
      onMatchPair={(lineNumber, tileIdx) => {
        if (localStorage.babbelgames_session_token && episodeMD5) {
          $.ajax("/progress/correctMatch", {
            data: JSON.stringify({
              line_number: lineNumber,
              tile_idx: tileIdx,
              session_token: localStorage.babbelgames_session_token,
              episode_md5: episodeMD5,
            }),
            contentType: 'application/json',
            type: 'POST',
          });
        }
    }}
    onMatchAllPairs={(() => {
      if (state.showRandom) {
        console.log('next!');
      } else {
        console.log('scroll down!');
      }
    })}
    />
  );
}

const langNameOfCode = (code) => {
  return {
    'de': 'German',
    'fr': 'French',
    'pt-br': 'Portuguese'
  }[code];
}

const Header = React.createClass({
  render: function () {
    return <div className={styles.header}>
      <div className={styles.imageContainer}>
        <img src={this.props.posterImageSrc}/>
        <div>
          <h1>{this.props.title}</h1>
          <h2>{this.props.subtitle}</h2>
        </div>
      </div>
    </div>
  }
});


const MatchingGame = React.createClass({
  propTypes: {
    tileData: React.PropTypes.array,
    matchedPairs: React.PropTypes.array,
    episodeMD5: React.PropTypes.string,
    metadata: React.PropTypes.object,
    posterImageSrc: React.PropTypes.string,
    screenplaySections: React.PropTypes.array,
  },
  getInitialState: function() {
    return {
      showAll: false, /* whether the show all button has been pressed */
      showRandom: false, /* whether to show in random order */
    };
  },

  handleToggleShowRandom: function () {
    this.setState({
      showRandom: !this.state.showRandom,
    });
  },

  render: function() {
    const renderChunks = (chunks, i) => {
      return renderChunksFull(this.state, this.props.tileData, this.props.matchedPairs, this.props.episodeMD5, chunks, i);
    }

    const l2Name = langNameOfCode[this.props.metadata.l2_code];

    const shuffledSlabs = gameScreenHelper.shuffle(this.props.rngSeed, this.props.screenplaySections)

    const randomSlab = <div>
    {renderChunks(shuffledSlabs[0])}
    </div>

    return (
      <div>

        {/* header */}
        <Header
          posterImageSrc={this.props.posterImageSrc}
          title={this.props.metadata.title}
          subtitle={this.props.metadata.subtitle}
        />

        {/* debug info */}
        <div>
          <div>Random: <button onClick={this.handleToggleShowRandom}>{JSON.stringify(this.state.showRandom)}</button></div>
          <div>{this.props.rngSeed}</div>
        </div>

        {/* instructions */}
        <div className={styles.gamescreen}>
          <div className={styles.slightPadding}>
          Welcome to babbelgames.io. <br /> <br />
          Match the {l2Name} and English phrases. Click on an English phrase (orange button) to select it, and then click on the matching {l2Name} phrase (in blue).
          </div>
        </div>

        {this.state.showRandom
          ? randomSlab
          : <div>
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
        }





        </div>

    );
  }
});

export default MatchingGame;
