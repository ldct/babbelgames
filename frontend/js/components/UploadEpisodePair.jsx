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
import $ from "jquery";

import { browserHistory } from 'react-router'


const UploadButton = React.createClass({
    getInitialState: function () {
        return {
            selectedFilename: null,
        };
    },
    handleClickButton: function () {
        this.refs.fileUpload.click();
    },
    handleFileChange: function (evt) {
        this.setState({
            selectedFilename: evt.target.files[0].name,
        });
        this.props.onFileChange(evt)
    },
    render: function () {
        const buttonLabel = this.state.selectedFilename
            ? (this.state.selectedFilename + " (" + this.props.label + " - click to change file)")
            : ("upload " + this.props.label)
        return <div>
            <FlatButton
                label={buttonLabel}
                onClick={this.handleClickButton}
                style={this.props.style}
                backgroundColor="#eeeff2"
            />
            <input
              ref="fileUpload"
              type="file"
              style={{"display" : "none"}}
              onChange={this.handleFileChange}/>

        </div>
    }
});


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
                encoded_image: this.state.encodedImage,
            }),
            success: function (res) {
                browserHistory.push('/page/game/' + res);
            },
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
            const l2SrtText = res.target.result;
            console.log(l2SrtText);
            this.setState({
                'l2SrtText': l2SrtText,
            });
        };
        reader.readAsText(evt.target.files[0]);
    },
    handleImageChange: function (evt) {
        const reader = new FileReader();
        reader.onloadend = (res) => {
            const encodedImage = btoa(String.fromCharCode.apply(null, new Uint8Array(res.target.result)));
            console.log(encodedImage);
            this.setState({
                'encodedImage': encodedImage,
            });
        };
        reader.readAsArrayBuffer(evt.target.files[0]);
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
                        style={{width: '100%'}}
                    >
                        <MenuItem value='fr' primaryText="French" />
                        <MenuItem value='de' primaryText="German" />
                        <MenuItem value='pt-br' primaryText="Portuguese (Brazilian)" />
                    </SelectField>

                    <UploadButton
                        style={{width: '100%', marginTop: '25px', marginBottom: '5px', border: '1px solid #D8D9DC'}}
                        onFileChange={this.handleEnglishSrtChange}
                        label="english subtitle file"
                    />

                    <UploadButton
                        style={{width: '100%', marginTop: '25px', marginBottom: '5px', border: '1px solid #D8D9DC'}}
                        onFileChange={this.handleEnglishScreenplayChange}
                        label="english screenplay"
                    />

                    <UploadButton
                        style={{width: '100%', marginTop: '25px', marginBottom: '5px', border: '1px solid #D8D9DC'}}
                        onFileChange={this.handleL2SrtChange}
                        label="l2 .srt file"
                    />

                    <UploadButton
                        style={{width: '100%', marginTop: '25px', marginBottom: '5px', border: '1px solid #D8D9DC'}}
                        onFileChange={this.handleImageChange}
                        label="Image"
                    />

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
