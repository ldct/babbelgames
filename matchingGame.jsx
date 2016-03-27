var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function () {
    return <div>
      <div>{
        this.props.matchingActivityData.map(function (pair) {
          return <div>{
            pair.map(function (line) {
              return <span style={{
                backgroundColor: 'pink',
                border: '1px solid black',
                width: '5em',
                position: 'absolute',
                top: Math.round(Math.random() * 500),
                left: Math.round(Math.random() * 500)
              }}>{line}</span>              
            })
          }</div>
        })
      }</div>
    </div>
  }
});

fetch('/sentenceMatchingGame/random.json').then(function (response) {
  return response.json();
}).then(function (res) {
  console.log(res);
  ReactDOM.render(
    <App matchingActivityData={res} />,
    document.getElementById('container')
  );
});
