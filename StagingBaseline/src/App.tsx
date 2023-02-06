import React, {useState} from "react";
import streamLogo from "./assets/img/GCIcon.svg";
import Link from "@material-ui/core/Link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "./App.css";
// import { Modal } from "antd";
import $ from 'jquery';
import { StageBaselineController } from "./core/controller/StageBaselineController";
import { AjaxResponse } from "rxjs/ajax";


const sbController = new StageBaselineController();

class App extends React.Component<{name: string}, {GCName: string, allowCreateSB: boolean, updateSB: boolean}> {
    
    private RM:string[];
    

    constructor(props: any){
        super(props); 
        
        this.RM = [];

        this.state = {
            GCName : '',
            allowCreateSB: true,
            updateSB: true
        }
        this.loadGC();
    }

    openPopUp = () => {
        $("#stageBaselineButton").on('click', function(){
            $(window.top.document).find('body').append(
                `<div id="stabase1451" class="jazz-ui-modalunderlay-root is-visible" style="z-index: 991;">
                <div class="jazz-ui-modalunderlay-modal is-visible" tabindex="0" style="z-index: 995;"></div>
                <div
                    class="jazz-ui-Dialog modal front front-modal is-visible"
                    dojoattachpoint="dialogNode"
                    role="dialog"
                    aria-labelledby="jazz_ui_Dialog_0_heading"
                    tabindex="-1"
                    id="jazz_ui_Dialog_0"
                    widgetid="jazz_ui_Dialog_0"
                    style="width: 650px; top: 0px; left: 0px; z-index: 999;">
                    <span tabindex="0"></span>
                    <div class="jazz-ui-Dialog-header" dojoattachpoint="headerContainerNode" style="cursor: move;">
                        <div class="jazz-ui-Dialog-heading" id="jazz_ui_Dialog_0_heading">Stage Baseline</div>
                        <button id="clsBtn" class="jazz-ui-Dialog-close-button" dojoattachpoint="closeButton" aria-label="close"><div class="jazz-ui-Dialog-close-button-icon"></div></button>
                    </div>
                    <div class="jazz-ui-Dialog-content jazz-ui-Dialog-content-padding-sides" dojoattachpoint="containerNode">
                        <div class="gc-dialog" id="com_ibm_team_gc_web_app_configs_StageBaselineDialog_0" widgetid="com_ibm_team_gc_web_app_configs_StageBaselineDialog_0">
                            <div class="gc-dialog-header j-hint">Create a baseline staging stream hierarchy by copying the global configurations in the selected stream hierarchy.</div>
                            <div class="jazz-ui-message-box jazz-ui-message-box-noDisplay gc-margin-b" role="status" aria-live="assertive" id="com_ibm_team_gc_web_ui_EasyMessageBox_4" widgetid="com_ibm_team_gc_web_ui_EasyMessageBox_4">
                                <div dojoattachpoint="messageArea" class="messageArea"></div>
                            </div>
                            <div dojoattachpoint="_content">
                                <form class="gc-dialog-body" dojoattachevent="onsubmit: _onSubmitEvent">
                                    <table class="gc-form-table">
                                        <colgroup>
                                            <col width="1" />
                                            <col width="999" />
                                        </colgroup>
                                        <tbody dojoattachpoint="baseTbody">
                                            <tr dojoattachpoint="_titleRow" class="gc-display-none">
                                                <th class="j-label" scope="row">
                                                    <label for="CreateBaselineDialog_title_0">Name:</label>
                                                    <span
                                                        class="j-required"
                                                        title="This field is required"
                                                        aria-label="This field is required"
                                                        style="cursor: help;"
                                                        id="com_ibm_team_gc_web_ui_RequiredMarker_0"
                                                        widgetid="com_ibm_team_gc_web_ui_RequiredMarker_0"
                                                    >
                                                        <!-- NLS_CHARSET=UTF-8 -->*
                                                    </span>
                                                </th>
                                                <td>
                                                    <input type="text" id="CreateBaselineDialog_title_0" aria-required="true" autocomplete="off" class="gc-text-input gc-stretch" dojoattachpoint="titleText" dojoattachevent="oninput: tryEnableSubmit" />
                                                </td>
                                            </tr>
                                            <tr dojoattachpoint="_titleSuffixRow">
                                                <th class="j-label" scope="row">
                                                    <label dojoattachpoint="_titleSuffixLabel" for="CreateBaselineDialog_titleSuffix_0" class="jazz-app-ua-TextHoverHelp">Name Suffix:</label>
                                                    <span
                                                        class="j-required"
                                                        title="This field is required"
                                                        aria-label="This field is required"
                                                        style="cursor: help;"
                                                        id="com_ibm_team_gc_web_ui_RequiredMarker_1"
                                                        widgetid="com_ibm_team_gc_web_ui_RequiredMarker_1"
                                                    >
                                                        <!-- NLS_CHARSET=UTF-8 -->*
                                                    </span>
                                                </th>
                                                <td><input type="text" id="CreateBaselineDialog_titleSuffix_0" autocomplete="off" class="gc-text-input gc-stretch" dojoattachpoint="titleSuffixText" dojoattachevent="oninput: tryEnableSubmit" /></td>
                                            </tr>
                                            <tr dojoattachpoint="_tagsRow" class="gc-display-none">
                                                <th class="j-label" scope="row"><label for="CreateBaselineDialog_tags_0">Tags:</label></th>
                                                <td dojoattachpoint="_tagsContainer">
                                                    <div
                                                        class="jazz-ui-control-border jazz-ui-TagBox"
                                                        dojoattachevent="onclick: _onClickBackground"
                                                        role="combobox"
                                                        aria-autocomplete="list"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        id="jazz_ui_TagBox_1"
                                                        widgetid="jazz_ui_TagBox_1"
                                                    >
                                                        <!-- Tags go here -->
                                                        <span
                                                            class="jazz-ui-TagBubble jazz-ui-TagBubble--canHover"
                                                            tabindex="-1"
                                                            dojoattachevent="onclick: _onClick, onkeypress: _onKeyPress"
                                                            id="jazz_ui_internal_TagBubble_1"
                                                            widgetid="jazz_ui_internal_TagBubble_1"
                                                            aria-label="Tag platform/ab15"
                                                        >
                                                            <span dojoattachpoint="_nameNode">platform<span class="jazz-ui-TagBubble__slash"> / </span>ab15</span>
                                                            <span class="jazz-ui-TagBubble__remove" role="button" title="Remove Tag" dojoattachevent="onclick: _onRemove" dojoattachpoint="_removeButton">
                                                                <span class="jazz-ui-TagBubble-removeIcon"></span>
                                                            </span>
                                                        </span>
                                                        <input
                                                            type="text"
                                                            role="textbox"
                                                            class="jazz-ui-TagBox__input"
                                                            dojoattachpoint="_input"
                                                            placeholder=""
                                                            autocomplete="off"
                                                            spellcheck="false"
                                                            dojoattachevent="onkeypress: _onInputKeyPress, onkeyup: _onInputKeyUp"
                                                            aria-label="Tags"
                                                            id="CreateBaselineDialog_tags_0"
                                                        />
                                                        <span class="jazz-ui-TagBox__caret jazz-ui-fat-caret" title="All Tags" dojoattachevent="onclick: _toggleSuggestionMenu" dojoattachpoint="_allTagsButton"></span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr dojoattachpoint="_descriptionRow">
                                                <th class="j-label" scope="row" for="CreateBaselineDialog_description_0"><label for="CreateBaselineDialog_description_0">Description:</label></th>
                                                <td><textarea type="text" id="CreateBaselineDialog_description_0" class="gc-textarea gc-stretch" dojoattachpoint="descriptionText" dojoattachevent="oninput: tryEnableSubmit"></textarea></td>
                                            </tr>
                                            <div id="messageError"><div>
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                            <div class="gc-dialog-footer j-buttonGroup-bleed-two">
                                <button id="cancelCreateSB" class="j-button-secondary" type="button">Cancel</button>
                                <button id="confirmCreateSB" class="j-button-primary" type="button">OK</button>
                            </div>
                        </div>
                    </div>
                    <div class="jazz-ui-Dialog-footer" dojoattachpoint="footerContainerNode"></div>
                    <span tabindex="0"></span>
                </div>
            </div>
            `
            );

            $(window.top.document).find('#cancelCreateSB').on('click', function(){
                $(window.top.document).find('#stabase1451').remove();
            });
        
            $(window.top.document).find('#clsBtn').on('click', function(){
                $(window.top.document).find('#stabase1451').remove();
            });

            $(window.top.document).find('#confirmCreateSB').on('click', function(){
                let title = String($(window.top.document).find('#CreateBaselineDialog_titleSuffix_0').val());
                title = title.trim();

                if(title === undefined || title === ''){
                    if($(window.top.document).find('#messageError').children() != undefined){
                        $(window.top.document).find('#messageError').children().remove();
                    }
                    $(window.top.document).find('#messageError').append("<p style='color:red'>Name Suffix must not be empty</p>");
                    return;
                }

                let url = window.top.location.origin + '/gc/gc.webui.createBaseline';
                let startIndex = window.top.location.hash.indexOf('https');
                let endIndex = window.top.location.hash.indexOf('%20');
                let uri = window.top.location.hash.substring(startIndex?startIndex:0, endIndex == -1?undefined:endIndex);

                var paramArg = {
                    'uri': uri,
                    'titleSuffix': $(window.top.document).find('#CreateBaselineDialog_titleSuffix_0').val(),
                    'description': $(window.top.document).find('#CreateBaselineDialog_description_0').val()
                }
                sbController.createStageBaseline(url, paramArg).subscribe({
                    next: value => {
                        let obj = JSON.parse(String(value));


                        // navigate to Staging baseline which has be just created.
                        window.top.location.href = obj.uri;
                    },
                    error: err => console.log(err)
                });
                
                $(window.top.document).find('#stabase1451').remove();
            });

        });
        
    }

    loadGC = () => {
        let url = window.top.location.origin + '/gc/gc.webui.getTreeNode';

        let startIndex = window.top.location.hash.indexOf('https');
        let endIndex = window.top.location.hash.indexOf('%20');
        let uri = window.top.location.hash.substring(startIndex?startIndex:0, endIndex == -1?undefined:endIndex);

        sbController
        .getRootGCLink(url, uri)
        .subscribe({
            next: value =>{
                let obj = JSON.parse(String(value));
                // this.setState({GCName: obj.title});
                if(obj.fromStreamUri != undefined){
                    this.setState({GCName: obj.title, allowCreateSB: false, updateSB: true});
                }else{
                    this.setState({GCName: obj.title, allowCreateSB: true, updateSB: false});
                }

            },
            error: err => console.log(err)
        });
    }

    updateBaseline = () => {
        $("#replaseBaseline").on('click', function(){
            let updateAPI = sbController.replaceBodyContent();
            let etagMap = sbController.getGCEtag();

            updateAPI.forEach((value, key) => {
                let etag = etagMap.get(key);
                sbController.updateLstBaseline(key, value, etag?etag:'').subscribe({
                    next: value => {                       
                        alert("Updating Staging Baseline successfully, please refesh!!!");
                    },
                    error: err => console.log(err)
                });
            });
            
        });
    }

    componentDidMount(){
        this.openPopUp();
        this.updateBaseline();

        let url = window.top.location.origin + '/gc/gc.webui.getTreeNode';

        let startIndex = window.top.location.hash.indexOf('https');
        let endIndex = window.top.location.hash.indexOf('%20');
        let uri = window.top.location.hash.substring(startIndex?startIndex:0, endIndex == -1?undefined:endIndex);
        this.getAllRM(url, uri);
    }

    getAllRM = (url: string, uri: string) => {
        sbController.getStreamRecursive(url, uri);
    }

    render() {
        return (
            <div className="container">    
                <div className="row">
                    <div className="head-container">
                        <div className="gc-image-container">
                            <img src={streamLogo} title="Stream" alt="Stream"
                                        className="logo-gc"/>
                        </div>
                        {this.state.GCName.length > 0 &&
                            <span className="staging-name">
                                {this.state.GCName}
                            </span>
                        }
                    </div>
                </div>
                {this.state.allowCreateSB &&
                    <div className="row">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button id="stageBaselineButton" type="button" className="btn btn-primary btn-custom-style">
                                Create Staging
                            </button>
                        </div>
                    </div>
                }
                {this.state.updateSB &&
                    <div className="row">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button id="replaseBaseline" type="button" className="btn btn-primary btn-custom-style">
                                Update SB
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;