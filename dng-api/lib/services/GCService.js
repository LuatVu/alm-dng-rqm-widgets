import { BaseService } from "../utils/BaseService";
import { map } from "rxjs/operators";
var GCService = /** @class */ (function () {
    function GCService() {
    }
    GCService.prototype.getGCStream = function (url, uri) {
        var params = {
            "uri": uri
        };
        var header = {
            Accept: '*/*'
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.getRequest(url, params).pipe(map(function (res) {
            return res;
        }));
    };
    GCService.prototype.getStreamFromBaseline = function (url, configId) {
        var params = {
            'configurationUri': configId
        };
        var service = new BaseService();
        return service.getRequest(url, params).pipe(map(function (res) {
            return res;
        }));
    };
    GCService.prototype.getBaselineFromStream = function (url, configId) {
        var params = {
            'validTypes': 'baseline',
            'pageStart': '0',
            'pageEnd': '100',
            'configurationId': configId
        };
        var header = {
            Accept: 'application/json'
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.getRequest(url, params).pipe(map(function (res) {
            return res;
        }));
    };
    GCService.prototype.getBaselineDetail = function (url, body) {
        var params = {};
        var header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'jsonp',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.postRequest(url, params, body);
    };
    GCService.prototype.getStreamDetail = function (url) {
        var params = {};
        var header = {
            Accept: 'application/rdf+xml'
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.getRequest(url, params).pipe(map(function (res) {
            return res;
        }));
    };
    GCService.prototype.getMetaDataResponse = function (url) {
        var params = {};
        var header = {
            Accept: 'application/rdf+xml'
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.getMetaDataResponse(url, params).pipe(map(function (res) {
            return res;
        }));
    };
    GCService.prototype.createStageBaseline = function (url, paramArg) {
        var params = {
            "uri": paramArg.uri,
            "step": "begin",
            "titleSuffix": paramArg.titleSuffix,
            "description": paramArg.description
        };
        var header = {
            Accept: '*/*'
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.postRequest(url, params);
    };
    GCService.prototype.updateLstBaseline = function (url, body, etag) {
        var header = {
            Accept: 'application/rdf+xml',
            'Content-Type': 'application/rdf+xml',
            'If-Match': etag
        };
        var service = new BaseService();
        service.setHeader(header);
        return service.putRequest(url, body);
    };
    return GCService;
}());
export { GCService };
//# sourceMappingURL=GCService.js.map