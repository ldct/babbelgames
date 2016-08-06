import styles from "../../css/loadingPage.css";
import React from "react";

const LoadingPage = React.createClass({
	render: function() {
		return <div id={styles.loaderWrapper}>
		  <div id={styles.preloader}>
		    <span></span>
		    <span></span>
		    <span></span>
		    <span></span>
		    <span></span>
		  </div>
		  <div>
		    <h2>Welcome to BabbelGames!</h2>
		    <p>Please Wait...</p>
		  </div>
		</div>
	}
});

export default LoadingPage;