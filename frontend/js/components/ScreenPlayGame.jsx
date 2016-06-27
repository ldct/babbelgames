import MatchingGame from "./MatchingGame.jsx";

import $ from "jquery";
import React from "react";

const screenplaySectionsOf = function (res) {
  var screenplayLines = res.screenplay.split('\n').map((e, i) => {
    return {
      'line': e,
      'lineNumber': i
    };
  });

  var screenplaySections = [];

  var workingScreenplaySection = [];

  while (screenplayLines.length > 0) {
    workingScreenplaySection = workingScreenplaySection.concat(screenplayLines[0]);
    screenplayLines = screenplayLines.slice(1);

    var doRotate = false;

    if (workingScreenplaySection.length > 9) {
      doRotate = true;
    }

    var lines = workingScreenplaySection.map(l => l.line).join(' ');
    if (lines.length > 300) {
      doRotate = true;
    }

    if (doRotate) {
      screenplaySections = screenplaySections.concat([workingScreenplaySection]);
      workingScreenplaySection = [];
    }

  }

  if (workingScreenplaySection.length) {
    screenplaySections = screenplaySections.concat([workingScreenplaySection]);
  }

  screenplaySections = screenplaySections.map(chunk => {
    return {
      chunk: chunk,
      rngSeed: Math.random() * 100000
    }
  });

  return screenplaySections;
}

var ScreenPlayGame = React.createClass({
  getInitialState: function() {
    return {
      metadata: {title: "", subTitle: ""},
      tileData: [],
      posterImageSrc: "",
      screenplaySections: []
    };
  },

  // Only one prop passed in which is the dataSource
  componentDidMount: function() {
    var that = this,
        src = this.props.params.dataSource.replace(".", "/");


    $.getJSON('/sentenceMatchingGame/' + src).then(res => {
      const episodeMD5 = md5(JSON.stringify(res.tileData));
      if (!localStorage.babbelgames_session_token) {
        this.updateState(res, this.props.params.dataSource, screenplaySectionsOf(res), []);
      } else {
        $.getJSON('/progress/correctMatch/' + episodeMD5 + '?session_token=' + localStorage.babbelgames_session_token).then(pres => {
          this.updateState(res, this.props.params.dataSource, screenplaySectionsOf(res), pres);
        });
      }
    });
  },

  updateState: function(res, dataSource, screenplaySections, matchedPairs) {
    this.setState({
      matchedPairs: matchedPairs,
      metadata: res.metadata,
      tileData: res.tileData,
      posterImageSrc: "/img/" + dataSource.replace('.srt.json', '.jpg'),
      screenplaySections: screenplaySections
    });
  },

  render: function() {
    return (
      <MatchingGame
        matchedPairs={this.state.matchedPairs}
        episodeMD5={md5(JSON.stringify(this.state.tileData))}
        metadata={this.state.metadata}
        tileData={this.state.tileData}
        posterImageSrc={this.state.posterImageSrc}
        screenplaySections={this.state.screenplaySections} />
    );
  }
});


export default ScreenPlayGame;
