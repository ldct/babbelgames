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

var App = React.createClass({
  render: function () {
    var tiles = [];

    var frTilesData = this.props.matchingActivityData.map(function (pair, i) {
      return {
        'text': pair[1],
        'lang': 'fr',
        'key': i
      };
    });

    var enScrambledTilesData = this.props.matchingActivityData.map(function (pair, i) {
      return {
        'text': pair[0],
        'lang': 'en',
        'key': i
      };
    });

    shuffle(enScrambledTilesData);

    return <div>
      <div>{
        frTilesData.map(function (frTileData) {
          return <Tile 
            text={frTileData.text}
            lang="fr" />
        })
      }</div>
      <div>{
        enScrambledTilesData.map(function (enTileData) {
          return <Tile 
            text={enTileData.text}
            lang="en" />
        })
      }</div>


    </div>


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
