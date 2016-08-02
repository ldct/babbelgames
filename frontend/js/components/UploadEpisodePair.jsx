import styles from "../../css/episodeTile.css";

import React from "react";
import { Link } from "react-router";

const UploadEpisodePair = React.createClass({
    handleSubmit: function () {

        $.ajax({
            type: 'POST',
            url: '/uploadEpisodePair/',
            data: JSON.stringify({
                english_srt_text: this.state.englishSrtText,
                english_screenplay_text: this.state.englishScreenplayText,
                l2_srt_text: this.state.l2SrtText,
                session_token: localStorage.babbelgames_session_token,
                series_name: this.refs.seriesName.value,
                episode_seqnumber: this.refs.episodeSeqnumber.value,
                episode_title: this.refs.episodeTitle.value,
                l2_code: this.refs.l2Code.value,
            }),
            success: function (res) { console.log(res) },
            contentType: "application/json",
            dataType: 'json'
        });
    },
    handleEnglishSrtChange: function (evt) {
        const reader = new FileReader();
        reader.onloadend = (res) => {
            this.setState({
                'englishSrtText': res.target.result,
            });
        };
        reader.readAsText(evt.target.files[0]);
    },
    handleEnglishScreenplayChange: function (evt) {
        const reader = new FileReader();
        reader.onloadend = (res) => {
            this.setState({
                'englishScreenplayText': res.target.result,
            });
        };
        reader.readAsText(evt.target.files[0]);
    },
    handleL2SrtChange: function (evt) {
        const reader = new FileReader();
        reader.onloadend = (res) => {
            this.setState({
                'l2SrtText': res.target.result,
            });
        };
        reader.readAsText(evt.target.files[0]);
    },
    render: function () {
        return <div style={{marginTop: 100}}>
            <h1>UploadEpisodePair</h1>
            <table><tbody>
                <tr>
                    <td style={{textAlign: 'right'}}>Series Name</td>
                    <td><input ref="seriesName" type="text" defaultValue="Friends"></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>Episode Sequence Number</td>
                    <td><input ref="episodeSeqnumber" type="text" defaultValue="s01e04"></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>Episode Title</td>
                    <td><input type="text" ref="episodeTitle" defaultValue="The One With George Stephanopoulos"></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>Language</td>
                    <td>
                        <select name="select" ref="l2Code">
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="pt-br">Portuguese (Brazilian)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>English SRT</td>
                    <td><input type="file" onChange={this.handleEnglishSrtChange}></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>English Screenplay</td>
                    <td><input type="file" onChange={this.handleEnglishScreenplayChange}></input></td>
                </tr>
                <tr>
                    <td style={{textAlign: 'right'}}>L2 SRT</td>
                    <td><input type="file" onChange={this.handleL2SrtChange}></input></td>
                </tr>
                <tr>
                    <td></td>
                    <td><button onClick={this.handleSubmit}>Submit</button></td>
                </tr>
            </tbody></table>
        </div>
    }
});

export default UploadEpisodePair;
