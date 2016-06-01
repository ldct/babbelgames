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
    }} onClick={this.props.onClick}>
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
      selectedIdx: null,
    };
  },
  handleEnglishClick: function (idx) {
    this.setState({
      selectedIdx: idx,
    });
  },
  handleFrenchClick: function (e, i, j) {
    if (e === this.state.englishTiles[this.state.selectedIdx]) {
      this.setState({
        matchedIds: this.state.matchedIds.concat(this.state.selectedIdx),
        matchedFrIdxs: this.state.matchedFrIdxs.concat(i + '-' + j),
      });
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

    return <div style={{
      display: 'flex',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 10,
      borderRadius: 2,
      boxShadow: '0 1px 2px 1px rgba(0,0,0,0.09)',
      backgroundColor: 'white',
    }}>
    <div style={{display: 'flex', flexDirection: 'column', flex: '2 0 0'}}>
    {this.props.sentences.map((sentence, i) => {

      if (sentence.line.length === 0) return null;

      const lineStyle = {
        margin: '0.5em',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      };

      var matchingTileData = this.props.tileData.filter(td => {
        return td[3] == sentence.lineNumber;
      });

      if (matchingTileData.length === 0) return <div key={i} style={lineStyle}>{sentence.line}</div>

      var speakerName = sentence.line.split(":")[0];

      return <div key={i} style={lineStyle}>
        <span style={{marginRight: '0.5em'}} key={i}>{speakerName}</span>
        {matchingTileData.map((td, j) => {
          return <FlippableSentence
            key={j}
            displayBoth={this.state.matchedFrIdxs.indexOf(i + "-" + j) !== -1}
            onClick={this.handleFrenchClick.bind(this, td[0], i, j)}
            back={td[1]}
            front={td[0]} />
        })}
      </div>

    })}
    </div>

    <div style={{'display': 'flex', 'flexDirection': 'row', flexWrap: 'wrap', alignItems: 'flex-start', alignContent: 'center', flex: '1 0 0'}}>{englishTiles.map((e, i) => {
      var tileStyle = {
        display: 'inline-block', margin: 5,
        backgroundColor: this.props.selected ? '#D58313' : 'rgba(255, 147, 0, 0.7)',
        padding: 5,
        borderColor: '#e5e6e9 #dfe0e4 #d0d1d5',
        borderWidth: '1px',
        borderStyle: 'solid',
      };
      if (this.state.matchedIds.indexOf(i) !== -1) tileStyle['visibility'] = 'hidden';
      return <div key={i} onClick={this.handleEnglishClick.bind(this, i)} style={tileStyle}>{e}</div>;
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
  var screenplaySections = _.chunk(screenplayLines, 10).map(chunk => {
    return {
      chunk: chunk,
      rngSeed: Math.random() * 100000,
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
