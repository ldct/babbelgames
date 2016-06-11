import React from "react";

export default class EpisodeTile extends React.Component {
  handleClick() {
    console.log(this.props.imgPrefix);
  }

  render() {
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
}
