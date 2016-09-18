import React from "react";
import $ from "jquery";

const ShuffleWordsGameSlab = React.createClass({
    render: function () {
        return <pre>{JSON.stringify(this.props.tileData)}</pre>
    }
});

const ShuffleWordsGame = React.createClass({
    render: function () {
        return <div style={{
            marginTop: 90
        }}>
            {this.props.tileData.map((td, i) => {
                return <ShuffleWordsGameSlab key={i} tileData={td} />
            })}
        </div>
    }
});

export default ShuffleWordsGame;