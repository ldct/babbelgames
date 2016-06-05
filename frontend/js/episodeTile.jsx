var EpisodeTile = React.createClass({
  handleClick: function () {
    console.log(this.props.imgPrefix);
  },
  render: function () {

    var isSelected = !this.props.isPoster && this.props.srcOfMousedOverTile === this.props.src;

    var self = this;
    var tile = <div
      onMouseEnter={function () {
        self.props.onMouseEnter(self.props.src);
      }}
      onMouseLeave={function () {
        self.props.onMouseLeave(self.props.src);
      }}
      style={{
        display: 'inline-block',
        width: 182,
        height: 268,
        color: 'black',
        margin: 1,
        position: 'relative',
      }}
      onClick={this.handleClick} >
      <img
        style={{
          opacity: this.props.isPoster ? 1 : (isSelected ? 0.2 : 0.7),
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
        }}
        src={'/img/' + this.props.src.replace('/', '.') + '.jpg'} />
      <div
        style={{
          visibility: isSelected ? 'visible' : 'hidden',
          fontFamily: 'Georgia,serif',
          position: 'absolute',
          flexDirection: 'column',
          top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
        <div style={{maxWidth: '8em'}}>
        {self.props.headline}
        </div>
      </div>
    </div>

    if (this.props.isPoster) {
      return tile;
    } else {
      return <a href={"/screenplayGame.html?src=" + this.props.src + '.srt.json'}>
        {tile}
      </a>
    }

  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      srcOfMousedOverTile: null,
      showAbout: false,
    }
  },
  handleMouseOverTile: function (src) {
    this.setState({
      srcOfMousedOverTile: src,
    });
  },
  handleMouseOutTile: function (src) {
    if (this.state.srcOfMousedOverTile === src) {
      this.setState({
        srcOfMousedOverTile: null,
      });
    }
  },
  handleAboutClick: function () {
    this.setState({
      showAbout: true,
    });
  },
  render: function () {
    var mo = this.handleMouseOverTile;
    var ml = this.handleMouseOutTile;
    return <div className="flex-container">
      <div style={{marginBottom: 50}}>
      babbelgames
      </div>
      <div className="align-text-center">
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends.poster" isPoster={true} />
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends/s01e01" headline="The One Where Monica Gets a Roommate"/>
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends/s01e02" headline="The One With the Sonogram at the End"/>
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="friends/s01e03" headline="The One With the Thumb"/>
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="sherlock.poster" isPoster={true} />
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="sherlock/s01e01" headline="A Study in Pink" />
        <EpisodeTile srcOfMousedOverTile={this.state.srcOfMousedOverTile} onMouseLeave={ml} onMouseEnter={mo} src="sherlock/s01e02" headline="The Blind Banker" />
      </div>
      <div style={{marginTop: 50}}>
      <a style={{color: 'black'}} href="http://eepurl.com/b4kX5f" target="_blank">signup</a> / <a style={{color:'black'}} href="mailto:xuanji@gmail.com">contact</a> / <a style={{color: 'black'}} href="#" onClick={this.handleAboutClick}>about</a>
      </div>
      <div style={{marginTop: 10, visibility: this.state.showAbout ? 'visible' : 'hidden'}}>
      babbelgames.io creates fun language learning games based on real native content. click on a picture above to get started.
      </div>

    </div>
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);