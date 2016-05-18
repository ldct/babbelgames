/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
var shuffle = function (a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

var getQueryParameterByName = function (name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var Tile = React.createClass({
  render: function () {
    var self = this;
    return <div style={{
      backgroundColor: this.props.lang === 'en' ? (this.props.selected ? 'rgba(66, 143, 196, 1)' : 'rgba(66, 143, 196, 0.7)') : 'rgba(255, 147, 0, 0.7)',
      borderColor: '#e5e6e9 #dfe0e4 #d0d1d5',
      borderWidth: '1px',
      borderStyle: 'solid',
      padding: 10,
      width: '8em',
      height: '5em',
      borderRadius: 5,
      margin: '2px',
      verticalAlign: 'top',
      visibility: this.props.hidden ? 'hidden' : 'visible',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }} onClick={function () {
      self.props.handleClick(self.props.matchKey, self.props.lang);
    }} className = {((this.props.lang === 'en' && !this.props.selected) || (this.props.lang === 'fr')) ? 'dim-on-hover' : ''}>{this.props.text}</div>
  }
});

var BlankTile = React.createClass({
  render: function () {
    var self = this;
    return <div style={{
      backgroundColor: this.props.lang === 'en' ? 'pink' : 'lightblue',
      width: '8em',
      height: '5em',
      padding: 10,
      display: 'inline-block',
      verticalAlign: 'top',
      visibility: 'hidden',
      margin: '2px',
      border: '1px solid transparent',
    }} />
  }
});

var OrderedMatchingGame = React.createClass({
  getInitialState: function () {
    return {
      'selectedTile': null,
      'solved': []
    }
  },
  handleEnTileClick: function (matchKey, lang) {
    var self = this;
    if (self.state.selectedTile === null) {
      self.setState({
        'selectedTile': {
          'matchKey': matchKey,
          'lang': lang
        }
      })
    } else {
      if (self.state.selectedTile.matchKey === matchKey && self.state.selectedTile.lang !== lang) {
        self.setState({
          'solved': self.state.solved.concat(matchKey)
        })
      } else {
        console.log('no match!');
      }
      self.setState({
        'selectedTile': null
      });
    }
  },
  handleFrTileClick: function (matchKey, lang) {
    var self = this;
    if (self.state.selectedTile === null) { /* select a tile */
      self.setState({
        'selectedTile': {
          'matchKey': matchKey,
          'lang': lang
        }
      })
    } else { /* attempt a match */
      if (self.state.selectedTile.matchKey === matchKey && self.state.selectedTile.lang !== lang) {
        var newSolved = self.state.solved.concat(matchKey);
        this.props.onNumMatchedChanged(newSolved.length);
        self.setState({
          'solved': newSolved
        });
      }
      self.setState({
        'selectedTile': null
      });
    }
  },
  render: function () {

    var self = this;

    var enMatchedTilesData = [];

    var enScrambledTilesData = JSON.parse(JSON.stringify(self.props.enScrambledTilesData));
    var enSolvedTilesData = {}; // matchKey => tileData
    enScrambledTilesData.filter(function (enTileData) {
      return self.state.solved.indexOf(enTileData.matchKey) !== -1;
    }).forEach(function (enTileData) {
      enSolvedTilesData[enTileData.matchKey] = enTileData;
    });

    return <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}>{ /* fixed french */
        this.props.frTilesData.map(function (frTileData) {
          return <Tile
            text={frTileData.text}
            lang="fr"
            key={frTileData.matchKey}
            matchKey={frTileData.matchKey}
            selected={self.state.selectedTile && self.state.selectedTile.matchKey === frTileData.matchKey && self.state.selectedTile.lang === frTileData.lang}
            handleClick={self.handleFrTileClick}/>
        })
      }</div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}>{ /* unscrambled english */
        this.props.frTilesData.map(function (frTileData) {
          var matchKey = frTileData.matchKey;
          if (enSolvedTilesData[matchKey] === undefined) {
            return <BlankTile
              key={matchKey}
              lang='fr' />
          } else {
            return <Tile
              key={matchKey}
              text={enSolvedTilesData[matchKey].text}
              lang='en' />
          }
        })
      }</div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}>{ /* scrambled english */
        this.props.enScrambledTilesData.map(function (enTileData) {
          if (self.state.solved.indexOf(enTileData.matchKey) !== -1) {
            return <BlankTile key={enTileData.matchKey} lang='en' />
          }
          return <Tile
            text={enTileData.text}
            lang="en"
            key={enTileData.matchKey}
            matchKey={enTileData.matchKey}
            selected={self.state.selectedTile && self.state.selectedTile.matchKey === enTileData.matchKey && self.state.selectedTile.lang === enTileData.lang}
            handleClick={self.handleEnTileClick} />
        })
      }</div>
    </div>
  }
});

var TranslationsReference = React.createClass({
  render: function () {
    return null;
    return <h1>Translations Reference 2</h1>
  }
});

var ProgressBar = React.createClass({
  render: function () {
    const pct = 100 * this.props.done / this.props.total;
    return <div>
      <div style={{
        border: '1px solid black',
        width: pct + '%'
      }} />
      <pre>{this.props.done + '/' + this.props.total}</pre>
    </div>
  }
})

var App = React.createClass({
  getInitialState: function () {
    return {
      startIdx: this.props.initialStartIdx,
      numMatched: 0,
    };
  },
  handleNumMatchedChanged: function (numMatched) {
    var self = this;
    if (numMatched === 5) {
      this.setState({
        startIdx: self.state.startIdx + 1,
        numMatched: 0,
      });
    } else {
      this.setState({
        numMatched: numMatched,
      });
    }
  },
  render: function () {
    var self = this;

    var frTilesData = this.props.scrambledChunksOfActivityPairs[this.state.startIdx].frTilesData;
    var enScrambledTilesData = this.props.scrambledChunksOfActivityPairs[this.state.startIdx].enScrambledTilesData;


    return <div>
      <ProgressBar
        done={this.state.startIdx * 5 + this.state.numMatched}
        total={this.props.numPairs} />
      <OrderedMatchingGame
        key={this.state.startIdx}
        frTilesData={frTilesData}
        enScrambledTilesData={enScrambledTilesData}
        onNumMatchedChanged={this.handleNumMatchedChanged} />
      <TranslationsReference />
      </div>
  }
});

var dataSource = getQueryParameterByName('src') || 'friends.s01e01.srt.json';

fetch('/sentenceMatchingGame/' + dataSource).then(function (response) {
  return response.json();
}).then(function (res) {

  var start = parseInt(getQueryParameterByName('start'), 10) || 0;

  var activityPairs = res.slice(start); // [en, fr] pairs
  var chunksOfActivityPairs = _.chunk(activityPairs, 5);

  var scrambledChunksOfActivityPairs = chunksOfActivityPairs.map(function (chunk) {

    var frTilesData = chunk.map(function (pair, i) {
      return {
        'text': pair[1],
        'lang': 'fr',
        'matchKey': i
      };
    });

    var enScrambledTilesData = chunk.map(function (pair, i) {
      return {
        'text': pair[0],
        'lang': 'en',
        'matchKey': i
      };
    });

    shuffle(enScrambledTilesData);

    return {
      'frTilesData': frTilesData,
      'enScrambledTilesData': enScrambledTilesData,
    }

  });

  ReactDOM.render(
    <App
      scrambledChunksOfActivityPairs={scrambledChunksOfActivityPairs}
      numPairs={res.length}
      initialStartIdx={start} />,
    document.getElementById('container')
  );
});
