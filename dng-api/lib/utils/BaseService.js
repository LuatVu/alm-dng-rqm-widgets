import { __assign } from "tslib";
import { throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
var BaseService = /** @class */ (function () {
    function BaseService() {
        this.baseHeader = {
        // 'Content-Type': 'application/json', 
        // 'dataType': 'jsonp',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        };
    }
    BaseService.prototype.createRequest = function (request) {
        var _this = this;
        var method = request.method, url = request.url, body = request.body, params = request.params, responseType = request.responseType, handleResponse = request.handleResponse;
        var paramString = '';
        if (params) {
            var keys_1 = Object.keys(params);
            keys_1.forEach(function (key, index) {
                if (index < keys_1.length - 1) {
                    paramString += "".concat(key, "=").concat(params[key], "&");
                }
                else {
                    paramString += "".concat(key, "=").concat(params[key]);
                }
            });
        }
        var requestBuilder = {
            url: paramString === '' ? url : "".concat(url, "?").concat(paramString),
            body: body,
            method: method,
            headers: __assign(__assign({}, this.baseHeader), this.headers),
            crossDomain: true,
            responseType: responseType
        };
        return ajax(requestBuilder).pipe(map(function (res) {
            if (handleResponse) {
                return _this.handleResponse(res);
            }
            return res;
        }), catchError(function (error) {
            console.log(error);
            return _this.handleError(error);
        }));
    };
    BaseService.prototype.getMetaData = function (request) {
        var _this = this;
        var method = request.method, url = request.url, body = request.body, params = request.params, responseType = request.responseType, handleResponse = request.handleResponse;
        var paramString = '';
        if (params) {
            var keys_2 = Object.keys(params);
            keys_2.forEach(function (key, index) {
                if (index < keys_2.length - 1) {
                    paramString += "".concat(key, "=").concat(params[key], "&");
                }
                else {
                    paramString += "".concat(key, "=").concat(params[key]);
                }
            });
        }
        var requestBuilder = {
            url: paramString === '' ? url : "".concat(url, "?").concat(paramString),
            body: body,
            method: method,
            headers: __assign(__assign({}, this.baseHeader), this.headers),
            crossDomain: true,
            responseType: responseType
        };
        return ajax(requestBuilder).pipe(map(function (res) {
            return res.xhr.getResponseHeader('etag');
        }), catchError(function (error) {
            return _this.handleError(error);
        }));
    };
    BaseService.prototype.getRequest = function (url, params, responseType, handleResponse) {
        if (responseType === void 0) { responseType = 'text'; }
        if (handleResponse === void 0) { handleResponse = true; }
        var req = {
            method: 'GET',
            url: url,
            params: params,
            handleResponse: handleResponse,
            responseType: responseType
        };
        return this.createRequest(req);
    };
    BaseService.prototype.getMetaDataResponse = function (url, params, responseType, handleResponse) {
        if (responseType === void 0) { responseType = 'text'; }
        if (handleResponse === void 0) { handleResponse = true; }
        var req = {
            method: 'GET',
            url: url,
            params: params,
            handleResponse: handleResponse,
            responseType: responseType
        };
        return this.getMetaData(req);
    };
    BaseService.prototype.postRequest = function (url, params, body, responseType, handleResponse) {
        if (responseType === void 0) { responseType = 'text'; }
        if (handleResponse === void 0) { handleResponse = true; }
        var req = {
            method: 'POST',
            url: url,
            params: params,
            body: body,
            handleResponse: handleResponse,
            responseType: responseType
        };
        return this.createRequest(req);
    };
    BaseService.prototype.putRequest = function (url, body, responseType, handleResponse) {
        if (responseType === void 0) { responseType = 'text'; }
        if (handleResponse === void 0) { handleResponse = true; }
        var req = {
            method: 'PUT',
            url: url,
            body: body,
            handleResponse: handleResponse,
            responseType: responseType
        };
        return this.createRequest(req);
    };
    BaseService.prototype.handleResponse = function (response) {
        switch (response.status) {
            case 200: // OK
                break;
            case 201: // Created
                break;
            case 202: // Accepted
                break;
            case 203: // Non-Authoritative Information (since HTTP/1.1)
                break;
            case 204: // No Content
                break;
            default:
                break;
        }
        return response.response || null;
    };
    BaseService.prototype.handleError = function (error) {
        var newError = {
            status: 404,
            detail: error,
            message: error.message
        };
        switch (error.status) {
            case 400: // Bad Request
                newError.message = newError.message ? newError.message : 'Bad Request!';
                break;
            case 401: // Unauthorized (RFC 7235)
                newError.message = newError.message ? newError.message : 'Access is denied due to invalid credentials! Please Login again.';
                break;
            case 404: // Not Found
                newError.message = newError.message ? newError.message : 'Request not found. Please contact admin for report';
                break;
            case 500: // Internal Server Error
                newError.message = newError.message ? newError.message : 'Interal Server Error';
                break;
            case 502: //  Bad Gateway
            case 503: // Service Unavailable
            case 440: //  Login Time-out
            default:
                newError.message = newError.message ? newError.message : 'Some thing wrong. Please try again later!';
                break;
        }
        return throwError(newError);
    };
    BaseService.prototype.setHeader = function (header) {
        this.headers = header;
    };
    BaseService.prototype.setParams = function () {
    };
    return BaseService;
}());
export { BaseService };
//# sourceMappingURL=BaseService.js.map