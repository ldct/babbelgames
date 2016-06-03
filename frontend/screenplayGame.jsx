var getQueryParameterByName = function (name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var shuffle = function (a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(window.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

window.rngSeed = 1;
window.random = function () {
  var x = Math.sin(window.rngSeed++) * 10000;
  return x - Math.floor(x);
}

var FlippableSentence = React.createClass({
  render: function () {
    return <div style={{
      display: 'inline-block',
      marginRight: '0.5em',
      backgroundColor: this.props.selected ? 'rgba(66, 143, 196, 1)' : 'rgba(66, 143, 196, 0.7)',
      borderColor: '#e5e6e9 #dfe0e4 #d0d1d5',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: 2,
      padding: 2,
      height: '1.8em',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      'WebkitTouchCallout': 'none', /* iOS Safari */
      'WebkitUserSelect': 'none',   /* Chrome/Safari/Opera */
      'KhtmlUserSelect': 'none',    /* Konqueror */
      'MozUserSelect': 'none',      /* Firefox */
      'msUserSelect': 'none',       /* Internet Explorer/Edge */
      'userSelect': 'none',           /* Non-prefixed version*/
    }}
    onClick={this.props.onClick}
    className={(!this.props.selected && this.props.onClick) ? "dim-on-hover" : ""}>
      <div style={{
        fontSize: '0.7em',
        display: this.props.displayBoth ? 'block' : 'none',
      }}>{this.props.front}</div>
      <div>{this.props.back}</div>
    </div>
  }
});

var GameScreen = React.createClass({
  getInitialState: function () {
    return {
      matchedIds: [],
      matchedFrIdxs: [],
      selectedEnglishIdx: null,
      selectedFrenchIdx: null,
    };
  },
  attemptMatch: function (frI, frJ, enI) {

    const frenchBack = this.props.tileData.filter(td => {
      return td[3] == this.props.sentences[frI].lineNumber;
    })[frJ][0];

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
  handleEnglishClick: function (idx) {
    const frenchWasSelected = this.state.selectedFrenchIdx !== null;
    const englishWasSelected = this.state.selectedEnglishIdx !== null;

    if (!frenchWasSelected && !englishWasSelected) {
      this.setState({
        selectedEnglishIdx: idx,
      });
    }
    if (!frenchWasSelected && englishWasSelected) {
      this.setState({
        selectedEnglishIdx: null,
      });
    }
    if (frenchWasSelected && !englishWasSelected) {
      const [i, j] = this.state.selectedFrenchIdx.split('-');
      this.attemptMatch(parseInt(i, 10), parseInt(j, 10), idx);
    }
    if (frenchWasSelected && englishWasSelected) {
      console.log('assertion failed');
    }

  },
  handleFrenchClick: function (i, j) {

    const frenchWasSelected = this.state.selectedFrenchIdx !== null;
    const englishWasSelected = this.state.selectedEnglishIdx !== null;

    if (!frenchWasSelected && !englishWasSelected) {
      this.setState({
        selectedFrenchIdx: i + '-' + j,
      });
    }

    if (!frenchWasSelected && englishWasSelected) {
      this.attemptMatch(i, j, this.state.selectedEnglishIdx);
    }

    if (frenchWasSelected && !englishWasSelected) {
      this.setState({
        selectedFrenchIdx: null,
      });
    }

    if (frenchWasSelected && englishWasSelected) {
      console.log('assertion failed');
    }


  },
  componentDidMount: function () {
    var englishTiles = JSON.parse(JSON.stringify(this.props.tileData)).map(td => {
      return td[0];
    });
    window.rngSeed = this.props.rngSeed;
    shuffle(englishTiles);

    this.setState({
      englishTiles: englishTiles,
    });
  },
  render: function () {
    var englishTiles = JSON.parse(JSON.stringify(this.props.tileData)).map(td => {
      return td[0];
    });
    window.rngSeed = this.props.rngSeed;
    shuffle(englishTiles);

    const lineStyle = {
      margin: '0.75em',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    };

    return <div className="gamescreen">

    <div className="transcript-area">

    {this.props.sentences.map((sentence, i) => {

      if (sentence.line.length === 0) return null;

      var matchingTileData = this.props.tileData.filter(td => {
        return td[3] == sentence.lineNumber;
      });

      if (matchingTileData.length === 0) {
        return <div key={i} style={sentence.line.indexOf(':') === -1 ? Object.assign({}, lineStyle, {fontStyle: 'italic'}) : lineStyle}>{sentence.line}</div>
      }

      var speakerName = sentence.line.split(":")[0];

      return <div key={i} style={lineStyle}>
        <span style={{marginRight: '0.5em'}} key={i}>{speakerName}</span>
        {matchingTileData.map((td, j) => {
          const displayBoth = this.state.matchedFrIdxs.indexOf(i + "-" + j) !== -1;
          return <FlippableSentence
            selected={i + "-" + j === this.state.selectedFrenchIdx}
            key={j}
            displayBoth={this.state.matchedFrIdxs.indexOf(i + "-" + j) !== -1}
            onClick={displayBoth ? null : this.handleFrenchClick.bind(this, i, j)}
            back={td[1]}
            front={td[0]} />
        })}
      </div>

    })}
    </div>

    <div className="english-tiles-area">{englishTiles.map((e, i) => {
      var tileStyle = {
        display: 'inline-block', margin: 5,
        backgroundColor: (this.state.selectedEnglishIdx === i) ? '#D58313' : 'rgba(255, 147, 0, 0.7)',
        padding: 5,
        borderColor: '#e5e6e9 #dfe0e4 #d0d1d5',
        borderWidth: '1px',
        borderStyle: 'solid',
        'WebkitTouchCallout': 'none', /* iOS Safari */
        'WebkitUserSelect': 'none',   /* Chrome/Safari/Opera */
        'KhtmlUserSelect': 'none',    /* Konqueror */
        'MozUserSelect': 'none',      /* Firefox */
        'msUserSelect': 'none',       /* Internet Explorer/Edge */
        'userSelect': 'none',           /* Non-prefixed version*/
      };
      if (this.state.matchedIds.indexOf(i) !== -1) tileStyle['visibility'] = 'hidden';
      return <div key={i} onClick={this.handleEnglishClick.bind(this, i)} style={tileStyle} className={this.state.selectedEnglishIdx === i ? "" : "dim-on-hover"}>{e}</div>;
    })}</div>
    </div>
  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      startIdx: this.props.initialStartIdx,
      numMatched: 0,
    };
  },
  render: function () {
    return <div>
    <div style={{
      backgroundColor: '#44B78B',
      color: 'white',
      fontFamily: 'Montserrat,Arial,sans-serif',
      padding: '41px 40px 31px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{textAlign: 'right'}}>
        <a href="/index.html" style={{color: 'white'}}>back</a>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <img src={this.props.posterImageSrc} height={170} />
        <div style={{
          marginLeft: 30
        }}>
          <h1>{this.props.metadata.title}</h1>
          <h2>{this.props.metadata.subtitle}</h2>
        </div>
      </div>
    </div>
    <div> Hi </div>
    {this.props.screenplaySections.map((chunks, i) => {
      var lineNumbers = chunks.chunk.map(s => s.lineNumber);

      var minLineNumber = Math.min.apply(null, lineNumbers);
      var maxLineNumber = Math.max.apply(null, lineNumbers);

      var matchingTileData = this.props.tileData.filter((tileData) => {
        return minLineNumber <= tileData[3] && tileData[3] <= maxLineNumber;
      });

      return <GameScreen key={i} sentences={chunks.chunk} rngSeed={chunks.rngSeed} tileData={matchingTileData} />
    })}</div>
  }
});

var dataSource = getQueryParameterByName('src') || 'friends.s01e01.srt.json';
var startIdx = getQueryParameterByName('start') || 'friends.s01e01.srt.json';

fetch('/sentenceMatchingGame/' + dataSource).then(function (response) {
  return response.json();
}).then(function (res) {

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


  ReactDOM.render(
    <App
      metadata={res.metadata}
      tileData={res.tileData}
      posterImageSrc={"img/" + dataSource.replace('/', '.').replace('.srt.json', '.jpg')}
      screenplaySections={screenplaySections}
      initialStartIdx={startIdx} />,
    document.getElementById('container')
  );
});
