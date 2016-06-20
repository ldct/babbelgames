import styles from "../../css/episodeTileGallery.css";

import React from "react";

var AboutPage = React.createClass({

  render: function() {
    console.log('aboutpage');
    return <div style={{
      marginTop: 200,
      fontFamily: "Helvetica-Neue, Helvetica, Arial, sans-serif",
      marginLeft: 50,
      marginRight: 50,
    }}>
      <h1>About</h1>
      <div>
      Babbelgames.io creates fun language learning games based on real native content.
      </div>
    </div>
  }
});

export default AboutPage;
