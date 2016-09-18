import React from "react";
import $ from "jquery";

import LoadingPage from "./LoadingPage.jsx";
import ShuffleWordsGame from "./ShuffleWordsGame.jsx";

const ShuffleWordsGameContainer = React.createClass({
    getInitialState: function () {
        return {
            tileData: [],
        }
    },
    componentDidMount: function () {
        const url = '/sentenceMatchingGame/' + this.props.params.dataSource;

        $.getJSON(url).then(res => {
            console.log(res);
            this.setState({
                tileData: res.tileData,
            });
        });
    },
    render: function () {
        if (!this.state.tileData.length) {
            return <LoadingPage />
        } else {
            return <ShuffleWordsGame
                tileData={this.state.tileData}
            />
        }
    }
});

export default ShuffleWordsGameContainer;
