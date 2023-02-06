import {BaseService} from "../utils/BaseService";
import {map} from "rxjs/operators";

export class GCService {

    /**
     * Getting GC stream infor, stream infor and baseline infor.
     * Infomation consist of name, uri, title, ...
     * @param url template https://rb-ubk-clm-04.de.bosch.com:9443/gc/gc.webui.getTreeNode
     * @param uri this is GC stream's uri
     *          template https://rb-ubk-clm-04.de.bosch.com:9443/gc/configuration/321
     * @returns Observable<R> An Observable that emits the values from the source
     * 
     */
    public getGCStream(url: string, uri: string){
        const params = {
            "uri": uri
        }
        const header = {
            Accept: '*/*'
        }
        const service = new BaseService();
        service.setHeader(header);

        return service.getRequest(url, params).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    /**
     * This api all get streams which belong to a specific baseline
     * @param url template: https://rb-ubk-clm-04.de.bosch.com:9443/rm/localVersioning/configurations
     * @param configId this is baseline's uri
     *          template: https://rb-ubk-clm-04.de.bosch.com:9443/rm/cm/baseline/_yrGioE4dEeyhztM6IQLNRg
     * @returns Observable<R> An Observable that emits the values from the source
     */
    public getStreamFromBaseline(url: string, configId: string){
        const params = {
            'configurationUri': configId
        }
        const service = new BaseService();
        return service.getRequest(url, params).pipe(
            map(res => {
                return res;
            })
        );
    }


    /**
     * 
     * @param url template: https://rb-ubk-clm-04.de.bosch.com:9443/rm/localVersionExplorer/configurations
     * @param configId this is stream's uri
     *          template: https://rb-ubk-clm-04.de.bosch.com:9443/rm/cm/stream/_fUi0pqEpEeuB5O8rSQjkiQ
     * @returns Observable<R> An Observable that emits the values from the source
     */
    public getBaselineFromStream(url: string, configId: string){
        const params = {
            'validTypes': 'baseline',
            'pageStart': '0',
            'pageEnd': '100',
            'configurationId': configId

        }
        const header = {
            Accept: 'application/json'
        }
        const service = new BaseService();
        service.setHeader(header);
        return service.getRequest(url, params).pipe(
            map(res => {
                return res;
            })
        );
    }

    /**
     * Getting detail information of a specific baseline
     * @param url template: https://rb-ubk-clm-04.de.bosch.com:9443/rm/localVersioning/configurations
     * @param body 
     *             template:
     * {
            "queries": [
                {"configurationUri": "https://rb-ubk-clm-04.de.bosch.com:9443/rm/cm/baseline/_unnowFa-Ee2z3pa55MMW9g"}
            ]
        }
     * @returns 
     */
    public getBaselineDetail(url: string, body: any){
        const params = {};
        const header = {
            Accept: 'application/json',
            'Content-Type': 'application/json', 
            'dataType': 'jsonp',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
        
        const service = new BaseService();
        service.setHeader(header);

        return service.postRequest(url, params, body);
    }

    /**
     * Getting detail information of a specific stream
     * @param url template: https://rb-ubk-clm-04.de.bosch.com:9443/gc/configuration/430
     * @returns 
     */
    public getStreamDetail(url: string){
        const params = {};
        const header = {
            Accept: 'application/rdf+xml'
        }
        const service = new BaseService();
        service.setHeader(header);
        return service.getRequest(url, params).pipe(
            map(res => {
                return res;
            })
        );
    }

    public getMetaDataResponse(url: string){
        const params = {}
        const header = {
            Accept: 'application/rdf+xml'
        }
        const service = new BaseService();
        service.setHeader(header);
        return service.getMetaDataResponse(url, params).pipe(
            map(res => {
                return res;
            })
        );
    }


    /**
     * this method allow to create a new staging baseline
     * @param url template: https://rb-ubk-clm-04.de.bosch.com:9443/gc/gc.webui.createBaseline
     * @param paramArg template: https://rb-ubk-clm-04.de.bosch.com:9443/gc/configuration/319
     * @returns 
     */
    public createStageBaseline(url: string, paramArg: any){
        const params = {
            "uri": paramArg.uri,
            "step": "begin",
            "titleSuffix": paramArg.titleSuffix, 
            "description": paramArg.description
        }
        const header = {
            Accept: '*/*'
        }
        const service = new BaseService();
        service.setHeader(header);
        
        return service.postRequest(url, params);
    }

    /**
     * this method allow to update all baseline of a stream to lastest baseline corresponding
     * @param url template: https://rb-ubk-clm-04.de.bosch.com:9443/gc/configuration/430
     * @param body 
     * @param etag 
     * @returns 
     */
    public updateLstBaseline(url: string, body: string, etag: string){
        const header = {
            Accept: 'application/rdf+xml',
            'Content-Type': 'application/rdf+xml',
            'If-Match': etag
        };
        const service = new BaseService();
        service.setHeader(header);

        return service.putRequest(url, body);
    }

}