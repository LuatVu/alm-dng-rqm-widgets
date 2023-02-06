import { BaseService } from "../utils/BaseService";
import { map} from "rxjs/operators";


export class StageBaselineService {

    public getRootGCLink(url: string, uri: string){
        const params = {
            "uri": uri
        }
        const header = {
            Accept: '*/*'
        }
        const service = new BaseService();
        service.setHeader(header);

        return service.getRequest(url, params).pipe(
            map(res => {
                return res;
            })
        );

    }
    
    public getStreamFromSB(url: string, uri: string){
        const params = {
            "uri": uri
        }
        const header = {
            Accept: '*/*'
        }
        const service = new BaseService();
        service.setHeader(header);

        return service.getRequest(url, params, 'text').pipe(
            map(res => {
                return res;
            })
        );
    }

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

    public getDetailBaseline(url: string, body: any){
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

    public getStreamInfor(url: string){
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

    public refreshContent(url: string){
        const params = {};
        const header = {
            Accept: '*/*'
        };
        const service = new BaseService();
        service.setHeader(header);

        return service.postRequest(url, params);
    }
}