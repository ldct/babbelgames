import styles from "../../css/aboutPage.css";

import React from "react";

var AboutPage = React.createClass({

  render: function() {
    console.log("About Page");
    return (
      <div className={styles.aboutContainer}>
        <h1>About</h1>
        <div>
          Babbelgames.io creates fun language learning games based on real native content.
        </div>
      </div>
    );
  }
});

export default AboutPage;
