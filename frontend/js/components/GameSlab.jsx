import * as gameScreenHelper from "../utility/gameScreenHelper.jsx";
import ShuffledGameSlab from "./ShuffledGameSlab.jsx";
import React from "react";

var GameSlab = React.createClass({
  render: function () {
    var englishTiles = this.props.tileData.map(td => {
      return td[0];
    });

    englishTiles = gameScreenHelper.shuffle(this.props.rngSeed, englishTiles);

    return <ShuffledGameSlab
      controlPressed={this.props.controlPressed}
      englishTiles={englishTiles}
      initialMatchedPairs={this.props.initialMatchedPairs}
      sentences={this.props.sentences}
      rngSeed={this.props.rngSeed}
      tileData={this.props.tileData}
      onMatchPair={this.props.onMatchPair}
      onMatchAllPairs={this.props.onMatchAllPairs}
    />
  }
});

export default GameSlab;
