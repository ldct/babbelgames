var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function () {
    return <div>
      <div>Translate this sentence: {this.props.unscrambleActivityData.translated}</div>
      <div>{
        this.props.unscrambleActivityData.constituents.map(function (constituent) {
          return <span style={{
            backgroundColor: 'pink',
            margin: 10
          }}>{constituent}</span>
        })
      }</div>
    </div>
  }
});

fetch('/subtitle/random.json').then(function (response) {
  return response.json();
}).then(function (res) {
  ReactDOM.render(
    <App unscrambleActivityData={res} />,
    document.getElementById('container')
  );
});
