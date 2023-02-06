import { stringify } from "querystring";
import { StageBaselineService } from "../services/StageBaselineService";

export class StageBaselineController {


    private GCName: String;
    private GCLink: String;

    private RM: Map<string, string>;
    private GCRM: Map<string, any>;

    private GCEtag: Map<string, string>;
    private GCMetaData: Map<string, string>;

    public constructor(){
        this.GCName = "";
        this.GCLink = decodeURIComponent(window.parent.location.hash.substring(34));

        this.RM = new Map();
        this.GCRM = new Map();

        this.GCEtag = new Map();
        this.GCMetaData = new Map();
    }

    public getRootGCLink(url: string, uri: string){
        const sbService = new StageBaselineService();
        return sbService.getRootGCLink(url, uri);
    }


    private getStreamFromSB(url: string, uri: string){
        const sbService = new StageBaselineService();
        return sbService.getStreamFromSB(url, uri);
    }



    public createStageBaseline(url: string, paramArg: any){
        const sbService = new StageBaselineService();
        return sbService.createStageBaseline(url, paramArg);
    }

    // lay ra danh cach baseline tu 1 stream truyen vao
    public getBaselineFromStream(url: string, configId: string){
        const sbService = new StageBaselineService();
        return sbService.getBaselineFromStream(url, configId);
    }

    // Tu 1 baseline lay ra stream cua baseline do => sau do tu stream lay ra cac baseline cung stream do de so sanh
    public getStreamFromBaseline(url: string, configId: string){
        const sbService = new StageBaselineService();
        return sbService.getStreamFromBaseline(url, configId);
    }

    public getDetailBaseline(url: string, body: any){
        const sbService = new StageBaselineService();
        return sbService.getDetailBaseline(url, body);
    }

    public getStreamInfor(url: string){
        const sbService = new StageBaselineService();
        return sbService.getStreamInfor(url);
    }

    public getMetaDataResponse(url: string){
        const sbService = new StageBaselineService();
        return sbService.getMetaDataResponse(url);
    }

    public updateLstBaseline(url: string, body: string, etag: string){
        const sbService = new StageBaselineService();
        return sbService.updateLstBaseline(url, body, etag);
    }

    public refreshContent(url: string){
        const sbService = new StageBaselineService();
        return sbService.refreshContent(url);
    }


    // cac ham su ly de quy, bat dong bo, call back 
    public getStreamRecursive(url: string, uri: string){
        this.getStreamFromSB(url, uri).subscribe(
            {
                next: value => {
                    let obj = JSON.parse(String(value));
                    let children = obj.children;
                    for(let i = 0; i < children.length; i++){
                        if(children[i].appName != undefined && children[i].appName == 'RM'){
                            this.RM.set(decodeURIComponent(children[i].uri), decodeURIComponent(children[i].uri));

                            if(this.GCRM.get(decodeURIComponent(uri)) != undefined){
                                if(this.GCRM.get(decodeURIComponent(uri)).indexOf(children[i].uri) == -1){
                                    this.GCRM.get(decodeURIComponent(uri)).push(children[i].uri);
                                }
                            }else{
                                this.GCRM.set(decodeURIComponent(uri), [decodeURIComponent(children[i].uri)]);
                            }

                            let urlOrigin = window.parent.location.origin;
                            this.getLastestBaseline(urlOrigin, children[i].uri, children[i].uri);

                            this.setEtagMap(decodeURIComponent(uri));
                            this.setGCMetaDataMap(decodeURIComponent(uri));

                        }

                        // call recursive
                        if(children[i].children == true && children[i].uri.indexOf('gc/configuration') > -1){
                            this.getStreamRecursive(url, children[i].uri);
                        }
                    }
                },
                error: err => console.log(err)
            }
        );
        return;
    }


    private getLastestBaseline(url: string, uri: string, keyMap: string){
        if(uri.indexOf('stream') > -1){
            url = url + '/rm/localVersionExplorer/configurations';
            this.getBaselineFromStream(url, uri).subscribe(
                {
                    next: value => {
                        let res = String(value);
                        let obj = JSON.parse(res.substring(res.indexOf(`[`), res.indexOf(`]`)+ 1));
                        let body = { queries: [{}]};

                        // truong hop STREAM khong co baseline nao thi bo qua
                        if(obj.length == 0){
                            return;
                        }

                        for(let i = 0; i< obj.length; i++){
                            body.queries.push( {
                                'configurationUri': obj[i]
                            });
                        }
                        let urlDetailBline = window.parent.location.origin + '/rm/localVersioning/configurations';
                        this.getDetailBaseline(urlDetailBline, body).subscribe(
                            {
                                next: value => {
                                    let res = String(value);
                                    let openCurlyBracket = [];
                                    let closeCurlyBracket = [];
                                    for(let i = 0; i< res.length; i++){
                                        if(res[i] === '{'){
                                            openCurlyBracket.push(i);
                                        }
                                        if(res[i] === '}'){
                                            closeCurlyBracket.push(i+1);  // purpose to get literal }
                                        }
                                    }
                                    
                                    let temp = []
                                    for(let i = 1; i < openCurlyBracket.length; i++){
                                        let obj = JSON.parse(res.substring(openCurlyBracket[i], closeCurlyBracket[i-1]));
                                        temp.push(obj);
                                    }
                                    let lastestBaseline = temp.sort((a, b) => { return b.created - a.created})[0];
                                    this.RM.set(decodeURIComponent(keyMap), decodeURIComponent(lastestBaseline.id));
                                },
                                error: err => console.log(err)
                            }
                        );
                    },
                    error: err => console.log(err)
                }
            );
        }else if(uri.indexOf('baseline') > -1){
            url = url + '/rm/localVersioning/configurations';
            this.getStreamFromBaseline(url, uri).subscribe({
                next: value=> {
                    let obj = JSON.parse(String(value));
			        let streamURI = obj.parentStreamUri;
                    this.getLastestBaseline(window.parent.location.origin, streamURI, uri);
                },
                error: err => console.log(err)
            })
        }
    }


    // url: gc/configuration/{id}
    private setEtagMap(url:string){
        this.getMetaDataResponse(url).subscribe({
            next: value => {
                let etag = String(value);
                this.GCEtag.set(decodeURIComponent(url), etag);
            },
            error: err => console.log(err)
        });
    }

    // url: gc/configuration/{id}
    private setGCMetaDataMap(url: string){
        this.getStreamInfor(url).subscribe({
            next: value => {
                let body = String(value);
                this.GCMetaData.set(decodeURIComponent(url), body);
            },
            error: err => console.log(err)
        });
    }



    public getGCName(){
        return this.GCName;
    }

    public setGCName(GCName:any){
        this.GCName = GCName;
    }

    public getGCLink(){
        return this.GCLink;
    }

    public setGCLink(GCLink: any){
        this.GCLink = GCLink;
    }

    public getRM(){
        return this.RM;
    }

    public getGCRM(){
        return this.GCRM;
    }

    public getGCEtag(){
        return this.GCEtag;
    }

    public getGCMetaData(){
        return this.GCMetaData;
    }

    public replaceBodyContent(): Map<string, string>{
        let map = new Map<string, any>();

        this.GCRM.forEach((value, key) => {
            let body = String(this.GCMetaData.get(key));

            for(let i = 0; i < value.length; i++){
                body = body.replace(value[i], String(this.RM.get(value[i])));
            }
            map.set(key, body);
        });

        return map;
    }
}