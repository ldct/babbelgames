var React = require('react');
var ReactDOM = require('react-dom');

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

var Tile = React.createClass({
  render: function () {
    var self = this;
    return <div style={{
      backgroundColor: this.props.lang === 'en' ? 'pink' : 'lightblue',
      width: '8em',
      height: '6em',
      display: 'inline-block',
      margin: this.props.selected ? '1px' : '2px',
      verticalAlign: 'top',
      border: this.props.selected ? '2px solid black' : '1px solid black',
      visibility: this.props.hidden ? 'hidden' : 'visible'
    }} onClick={function () {
      self.props.handleClick(self.props.matchKey, self.props.lang);
    }}>{this.props.text}</div>
  }
});

var BlankTile = React.createClass({
  render: function () {
    var self = this;
    return <div style={{
      backgroundColor: this.props.lang === 'en' ? 'pink' : 'lightblue',
      width: '8em',
      height: '6em',
      display: 'inline-block',
      verticalAlign: 'top',
      visibility: 'hidden',
      margin: '2px'
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
  componentWillReceiveProps: function () {
    this.setState(this.getInitialState());
  },
  render: function () {

    var self = this;
    
    var enMatchedTilesData = []; // todo : populate and render

    var enScrambledTilesData = JSON.parse(JSON.stringify(self.props.enScrambledTilesData));
    var enSolvedTilesData = {};
    enScrambledTilesData.filter(function (enTileData) {
      return self.state.solved.indexOf(enTileData.matchKey) !== -1;
    }).forEach(function (enTileData) {
      enSolvedTilesData[enTileData.matchKey] = enTileData;
    });

    console.log(enSolvedTilesData);

    return <div>
      <div>{ /* fixed french */
        this.props.frTilesData.map(function (frTileData) {
          return <Tile 
            text={frTileData.text}
            lang="fr" 
            matchKey={frTileData.matchKey}
            selected={self.state.selectedTile && self.state.selectedTile.matchKey === frTileData.matchKey && self.state.selectedTile.lang === frTileData.lang}
            handleClick={function (matchKey, lang) {
              if (self.state.selectedTile === null) { /* select a tile */
                self.setState({
                  'selectedTile': {
                    'matchKey': matchKey,
                    'lang': lang
                  }
                })
              } else { /* attempt a match */
                if (self.state.selectedTile.matchKey === matchKey && self.state.selectedTile.lang !== lang) {
                  console.log('match!', self.state.solved.concat(matchKey));
                  var newSolved = self.state.solved.concat(matchKey);
                  if (newSolved.length === 5) {
                    self.props.onAllMatched();
                  }
                  self.setState({
                    'solved': newSolved
                  });
                } else {
                  console.log('no match!');
                }
                self.setState({
                  'selectedTile': null
                });
              }
            }}/>
        })
      }</div>

      <div>{ /* unscrambled english */
        this.props.frTilesData.map(function (frTileData) {
          var matchKey = frTileData.matchKey;
          if (enSolvedTilesData[matchKey] === undefined) {
            return <BlankTile lang='fr' />
          } else {
            return <Tile
              text={enSolvedTilesData[matchKey].text}
              lang='en' />
          }
        })
      }</div>

      <div>{ /* scrambled english */
        this.props.enScrambledTilesData.map(function (enTileData) {
          if (self.state.solved.indexOf(enTileData.matchKey) !== -1) {
            return <BlankTile lang='en' />
          }
          return <Tile 
            text={enTileData.text}
            lang="en"
            matchKey={enTileData.matchKey}
            selected={self.state.selectedTile && self.state.selectedTile.matchKey === enTileData.matchKey && self.state.selectedTile.lang === enTileData.lang}
            handleClick={function (matchKey, lang) {
              if (self.state.selectedTile === null) {
                self.setState({
                  'selectedTile': {
                    'matchKey': matchKey,
                    'lang': lang
                  }
                })
              } else {
                if (self.state.selectedTile.matchKey === matchKey && self.state.selectedTile.lang !== lang) {
                  console.log('match!', self.state.solved.concat(matchKey));
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
            }} />
        })
      }</div>
    </div>
  }
});

var Slab = React.createClass({
  render: function () {
    var tiles = [];

    var frTilesData = this.props.matchingActivityData.map(function (pair, i) {
      return {
        'text': pair[1],
        'lang': 'fr',
        'matchKey': i
      };
    });

    var enScrambledTilesData = this.props.matchingActivityData.map(function (pair, i) {
      return {
        'text': pair[0],
        'lang': 'en',
        'matchKey': i
      };
    });

    shuffle(enScrambledTilesData);

    return <OrderedMatchingGame
      frTilesData={frTilesData}
      enScrambledTilesData={enScrambledTilesData} 
      onAllMatched={this.props.onAllMatched} />

  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      startIdx: 0
    };
  },
  render: function () {
    var self = this;
    return <Slab 
      matchingActivityData={this.props.matchingActivityData.slice(this.state.startIdx, this.state.startIdx + 5)} 
      onAllMatched={function () {
        self.setState({
          startIdx: self.state.startIdx + 5
        });
      }} />
  }
});

fetch('/sentenceMatchingGame/all.json').then(function (response) {
  return response.json();
}).then(function (res) {
  ReactDOM.render(
    <App matchingActivityData={res} />,
    document.getElementById('container')
  );
});
