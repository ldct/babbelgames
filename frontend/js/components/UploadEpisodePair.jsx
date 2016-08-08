import styles from "../../css/episodeTile.css";

import React from "react";
import { Link } from "react-router";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


const UploadEpisodePair = React.createClass({
    getChildContext() {
        return { muiTheme: getMuiTheme({
            palette: {
                primary1Color: '#2096f3',
            },
        }) };
    },
    getInitialState: function () {
        return {
            'selectedL2Code': 'fr'
        };
    },
    handleL2CodeChange: function (event, index, value) {
        this.setState({
            'selectedL2Code': value,
        });
    },
    handleSubmit: function () {

        console.log(this.refs.seriesName.getValue());

        $.ajax({
            type: 'POST',
            url: '/uploadEpisodePair/',
            data: JSON.stringify({
                english_srt_text: this.state.englishSrtText,
                english_screenplay_text: this.state.englishScreenplayText,
                l2_srt_text: this.state.l2SrtText,
                session_token: localStorage.babbelgames_session_token,
                series_name: this.refs.seriesName.getValue(),
                episode_seqnumber: this.refs.episodeSeqnumber.getValue(),
                episode_title: this.refs.episodeTitle.getValue(),
                l2_code: this.state.selectedL2Code,
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

            <div style={{display: 'flex', flexDirection: 'column', 'alignItems': 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '80%', 'justifyContent': 'left'}}>
                    <h2>Upload New Episode</h2>
                    <TextField
                        style={{width: '100%', color: 'pink'}}
                        floatingLabelText="Series Name"
                        hintText="Friends"
                        ref="seriesName"
                    />
                    <TextField
                        style={{width: '100%'}}
                        floatingLabelText="Episode Sequence Number"
                        hintText="s01e04"
                        ref="episodeSeqnumber"
                    />
                    <TextField
                        style={{width: '100%'}}
                        floatingLabelText="Episode Title"
                        hintText="The One With George Stephanopoulos"
                        ref="episodeTitle"
                    />

                    <SelectField
                        value={this.state.selectedL2Code}
                        onChange={this.handleL2CodeChange}
                        floatingLabelText="Target Language"
                    >
                        <MenuItem value='fr' primaryText="French" />
                        <MenuItem value='de' primaryText="German" />
                        <MenuItem value='pt-br' primaryText="Portuguese (Brazilian)" />
                    </SelectField>

                    <div>English SRT</div>
                    <div><input type="file" onChange={this.handleEnglishSrtChange}></input></div>

                    <div>English Screenplay</div>
                    <div><input type="file" onChange={this.handleEnglishScreenplayChange}></input></div>

                    <div>L2 SRT</div>
                    <div><input type="file" onChange={this.handleL2SrtChange}></input></div>


                    <RaisedButton
                        label="Submit"
                        primary={true}
                        style={{width: 100, marginTop: 20}}
                        onClick={this.handleSubmit}
                    />
                </div>
            </div>


        </div>
    }
});

UploadEpisodePair.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};

export default UploadEpisodePair;
