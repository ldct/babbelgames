var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
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
})

var App = React.createClass({
  render: function () {
    var tiles = [];

    this.props.matchingActivityData.forEach(function (pair, i) {
      tiles.push({
        'text': pair[0],
        'lang': 'en',
        'key': i
      });
      tiles.push({
        'text': pair[1],
        'lang': 'fr',
        'key': i
      });
    });

    shuffle(tiles);

    return <MatchingGame tiles={tiles} />
  }
})

var MatchingGame = React.createClass({
  getInitialState: function () {
    return {
      'selectedTile': null,
      'solved': []
    }
  },
  render: function () {

    var self = this;

    console.log(self.state.solved);

    return <div style={{
      width: '37em'
    }}>{
      self.props.tiles.map(function (tile) {
        return <Tile 
          text={tile.text} 
          lang={tile.lang} 
          matchKey={tile.key}
          hidden={self.state.solved.indexOf(tile.key) !== -1}
          selected={self.state.selectedTile && self.state.selectedTile.matchKey === tile.key && self.state.selectedTile.lang === tile.lang}
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
  }
});

fetch('/sentenceMatchingGame/random.json').then(function (response) {
  return response.json();
}).then(function (res) {
  ReactDOM.render(
    <App matchingActivityData={res} />,
    document.getElementById('container')
  );
});
