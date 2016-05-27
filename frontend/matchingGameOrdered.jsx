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
      backgroundColor: this.props.lang === 'en' ? (this.props.selected ? 'rgba(66, 143, 196, 1)' : 'rgba(66, 143, 196, 0.7)') : (this.props.selected ? '#D58313' : 'rgba(255, 147, 0, 0.7)'),
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
      if (self.props.handleClick) {
        self.props.handleClick(self.props.matchKey, self.props.lang);
      }
    }} className = {(!this.props.selected && this.props.handleClick) ? 'dim-on-hover' : ''}>
      <span style={{
        fontSize: (this.props.text.length > 100) ? '0.8em' : '1em',
      }}>
        {this.props.text}
      </span>
    </div>
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

var ScreenplayInformationArea = React.createClass({
  render: function () {

    var largestPreviousLineNumber = null;

    for (var i=this.props.startIdx - 1; i>=0; i--) {
      var lineNumbers = this.props.scrambledChunksOfActivityPairs[i].frTilesData.map(td => td.lineNumber).filter(x => x);
      if (lineNumbers.length) {
        largestPreviousLineNumber = Math.max.apply(null, lineNumbers);
        break;
      }
    }

    largestPreviousLineNumber = largestPreviousLineNumber || 0;

    var screenplayLines = this.props.screenplayText.split('\n');

    var smallestNextLineNumber = null;

    for (var i=this.props.startIdx+1; i < this.props.scrambledChunksOfActivityPairs.length; i++) {
      var lineNumbers = this.props.scrambledChunksOfActivityPairs[i].frTilesData.map(td => td.lineNumber).filter(x => x);
      if (lineNumbers.length) {
        smallestNextLineNumber = Math.min.apply(null, lineNumbers);
        break;
      }
    }

    smallestNextLineNumber = smallestNextLineNumber || screenplayLines.length;

    var lineNumbers = this.props.scrambledChunksOfActivityPairs[this.props.startIdx].frTilesData.map(td => td.lineNumber).filter(x => x);

    var start, end;

    if (lineNumbers.length === 0) {
      start, end = largestPreviousLineNumber, smallestNextLineNumber;
    } else {
      var smallestHereLineNumber = Math.min.apply(null, lineNumbers);
      var largestHereLineNumber = Math.max.apply(null, lineNumbers);

      end = largestHereLineNumber;

      if (smallestHereLineNumber === largestPreviousLineNumber) {
        start = largestPreviousLineNumber;
      } else {
        start = largestPreviousLineNumber + 1;
      }
    }

    if (this.props.startIdx === 0) start = 0;

    console.log(start, end);


    return <div>
      {screenplayLines.slice(start, end+1).map((line, i) => {
        return <div key={i}>{line}</div>
      })}
    </div>

  }
});

var OrderedMatchingGame = React.createClass({ /* a slab of 10 tiles */
  getInitialState: function () {
    return {
      'selectedTile': null,
      'solved': []
    }
  },
  handleSolve: function (matchKey) {
    var newSolved = this.state.solved.concat(matchKey);
    this.props.onNumMatchedChanged(newSolved);
    this.setState({
      'solved': newSolved
    });
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
        this.handleSolve(matchKey);
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
        this.handleSolve(matchKey);
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
        this.props.frTilesData.map((frTileData) => {
          var clickable = self.state.solved.indexOf(frTileData.matchKey) === -1;
          return <Tile
            text={frTileData.speaker
              ? frTileData.speaker + ": " + frTileData.text + (frTileData.lineNumber ?
                ' /' + frTileData.lineNumber : '')
              : frTileData.text}
            lang="fr"
            key={frTileData.matchKey}
            matchKey={frTileData.matchKey}
            selected={self.state.selectedTile && self.state.selectedTile.matchKey === frTileData.matchKey && self.state.selectedTile.lang === frTileData.lang}
            handleClick={clickable ? self.handleFrTileClick : null}/>
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

var insertParam = function (key, value) {
    key = encodeURI(key); value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--)
    {
        x = kvp[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    console.log(kvp);

    window.history.replaceState(null, null, window.location.pathname + '?' + kvp.join('&'));
    // document.location.search = kvp.join('&');
}

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
  handleNumMatchedChanged: function (solved) {
    var self = this;



    if (solved.length === 5) {
      insertParam('start', self.state.startIdx + 1);
      this.setState({
        startIdx: self.state.startIdx + 1,
        numMatched: 0,
      });
    } else {
      this.setState({
        numMatched: solved.length,
      });
    }
  },
  render: function () {
    var self = this;

    var frTilesData = this.props.scrambledChunksOfActivityPairs[this.state.startIdx].frTilesData;
    var enScrambledTilesData = this.props.scrambledChunksOfActivityPairs[this.state.startIdx].enScrambledTilesData;


    return <div>
      <div style={{
        backgroundColor: '#44B78B',
        color: 'white',
        fontFamily: 'Montserrat,Arial,sans-serif',
        padding: '41px 40px 31px',
        display: 'flex',
      }}>
        <img src="/img/friends.s01e01.jpg" height={170} />
        <div style={{
          marginLeft: 30
        }}>
          <h1> The One Where Monica Gets a New Roommate </h1>
          <h2> Friends s01e01 </h2>
        </div>
      </div>
      <ProgressBar
        done={this.state.startIdx * 5 + this.state.numMatched}
        total={this.props.numPairs} />
      {this.props.screenplayText ?
        <ScreenplayInformationArea
          startIdx={this.state.startIdx}
          scrambledChunksOfActivityPairs={this.props.scrambledChunksOfActivityPairs}
          screenplayText={this.props.screenplayText} />
        : null
      }
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

  var activityPairs = res.tileData; // [en, fr] pairs

  var chunksOfActivityPairs = _.chunk(activityPairs, 5);

  var scrambledChunksOfActivityPairs = chunksOfActivityPairs.map(function (chunk) {

    var frTilesData = chunk.map(function (pair, i) {
      return {
        'text': pair[1],
        'speaker': pair[2],
        'lineNumber': pair[3],
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
      numPairs={res.tileData.length}
      screenplayText={res.screenplay}
      initialStartIdx={start} />,
    document.getElementById('container')
  );
});
