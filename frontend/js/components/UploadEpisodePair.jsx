import styles from "../../css/episodeTile.css";

import React from "react";
import { Link } from "react-router";

const UploadEpisodePair = React.createClass({
    render: function () {
        return <div style={{marginTop: 100}}>
            <h1>UploadEpisodePair</h1>
            <table>
                <tr>
                    <td style={{textAlign: 'right'}}>Language</td>
                    <td>
                        <select name="select">
                          <option value="value1">French</option>
                          <option value="value2" selected>German</option>
                          <option value="value3">Portuguese (Brazilian)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>English SRT</td>
                    <td><input type="file" id="input"></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>English Screenplay</td>
                    <td><input type="file" id="input"></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>L2 SRT</td>
                    <td><input type="file" id="input"></input></td>
                </tr>
            </table>
        </div>
    }
});

export default UploadEpisodePair;
