import * as gameScreenHelper from "../utility/gameScreenHelper.jsx";
import ShuffledGameSlab from "./ShuffledGameSlab.jsx";
import React from "react";

var GameSlab = React.createClass({
  render: function () {
    var englishTiles = JSON.parse(JSON.stringify(this.props.tileData)).map(td => {
      return td[0];
    });

    window.rngSeed = this.props.rngSeed;
    gameScreenHelper.shuffle(englishTiles);

    return <ShuffledGameSlab
      controlPressed={this.props.controlPressed}
      englishTiles={englishTiles}
      initialMatchedPairs={this.props.initialMatchedPairs}
      sentences={this.props.sentences}
      rngSeed={this.props.rngSeed}
      tileData={this.props.tileData}
      onMatchPair={this.props.onMatchPair}
    />
  }
});

export default GameSlab;
