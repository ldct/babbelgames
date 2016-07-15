import * as googleAnalytics from "../utility/googleAnalytics.jsx";
import styles from "../../css/app.css";

import EpisodeTileGalleryContainer from "./EpisodeTileGalleryContainer.jsx";
import AboutPage from "./AboutPage.jsx";
import NavigationBar from "./NavigationBar.jsx";
import MatchingGameContainer from "./MatchingGameContainer.jsx";
import UploadEpisodePair from "./UploadEpisodePair.jsx";

import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, Redirect} from "react-router";
import { browserHistory } from 'react-router'

const TestComponent = React.createClass({
    render: function () {
        return <div>
            <h1>Hi</h1>
            <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </div>
    }
});

const App = React.createClass({

    getIntialState: function() {
        return {
            currentEpisode: "friends/s01e01"
        };
    },

    render: function() {
        return (
            <div>
                <Router history={ browserHistory }>
                    <Redirect from="/" to="page/home" />
                    <Route path="/" component={NavigationBar}>"
                        <Route path="page/about" component={AboutPage} />
                        <Route path="page/home" component={EpisodeTileGalleryContainer} />
                        <Route path="page/game/:dataSource" component={MatchingGameContainer} />
                        <Route path="page/gameEditMode/:dataSource" editMode={true} component={MatchingGameContainer} />
                        <Route path="page/uploadEpisodePair" component={UploadEpisodePair} />
                    </Route>
                </Router>
            </div>
        );
    }

});

googleAnalytics.send();
ReactDOM.render(
  <App/>,
  document.getElementById('container')
);
