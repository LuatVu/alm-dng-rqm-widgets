import {throwError, Observable} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {map, catchError} from 'rxjs/operators';
import { AjaxResponse, AjaxError, AjaxRequest } from 'rxjs/internal/observable/dom/AjaxObservable';
import {RequestModel} from './Request';
import $, { param } from 'jquery';

export class BaseService{
    private headers: any;
    private baseHeader = {
        // 'Content-Type': 'application/json', 
        // 'dataType': 'jsonp',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    };
    private params: any;

    private createRequest<T>(request: RequestModel): Observable<T | AjaxResponse | null>{
        const {method, url, body, params, responseType, handleResponse} = request;
        let paramString = '';
        if(params){
            const keys = Object.keys(params);
            keys.forEach(
                (key, index) => {
                    if(index < keys.length - 1){
                        paramString += `${key}=${params[key]}&`;
                    } else {
                        paramString += `${key}=${params[key]}`;
                    }
                }
            );
        }
        const requestBuilder: AjaxRequest = {
            url: paramString === ''? url: `${url}?${paramString}`,
            body, 
            method,
            headers: {
                ...this.baseHeader,
                ...this.headers
            },
            crossDomain: true,
            responseType
        }
        return ajax(requestBuilder).pipe(
            map(res => {
                if (handleResponse) {
                    return this.handleResponse<T>(res);
                }
                return res;
            }),
            catchError(error => {
                console.log(error);
                return this.handleError(error)
            })
        );
    }


    public getMetaData<T>(request: RequestModel): Observable<T | string | null>{
        const {method, url, body, params, responseType, handleResponse} = request;
        let paramString = '';
        if(params){
            const keys = Object.keys(params);
            keys.forEach(
                (key, index) => {
                    if(index < keys.length - 1){
                        paramString += `${key}=${params[key]}&`;
                    } else {
                        paramString += `${key}=${params[key]}`;
                    }
                }
            );
        }
        const requestBuilder: AjaxRequest = {
            url: paramString === ''? url: `${url}?${paramString}`,
            body, 
            method,
            headers: {
                ...this.baseHeader,
                ...this.headers
            },
            crossDomain: true,
            responseType
        }
        return ajax(requestBuilder).pipe(
            map(res => {
                return res.xhr.getResponseHeader('etag');
            }),
            catchError(error => {
                return this.handleError(error)
            })
        );
    }

    public getRequest<T>(url: string, params?: any, responseType: string = 'text', handleResponse: boolean = true){
        const req: RequestModel = {
            method: 'GET',
            url, 
            params, 
            handleResponse, 
            responseType
        }
        return this.createRequest<T>(req);
    }

    public getMetaDataResponse<T>(url: string, params?:any, responseType: string = 'text', handleResponse: boolean = true){
        const req: RequestModel = {
            method: 'GET',
            url, 
            params, 
            handleResponse, 
            responseType
        }
        return this.getMetaData<T>(req);
    }


    public postRequest<T>(url: string, params?: any, body?: any, responseType: string='text', handleResponse: boolean = true){
        const req: RequestModel = {
            method: 'POST', 
            url,
            params,
            body, 
            handleResponse,
            responseType
        }
        return this.createRequest<T>(req);
    }

    public putRequest<T>(url: string, body: any, responseType: string = 'text', handleResponse: boolean = true){
        const req: RequestModel = {
            method: 'PUT',
            url,
            body, 
            handleResponse,
            responseType
        }
        return this.createRequest<T>(req);
    }


    private handleResponse<T>(response: AjaxResponse){
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
        return (response.response as T) || null;
    }

    private handleError(error: AjaxError) {
        const newError = {
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
    }

    setHeader(header: any){
        this.headers = header;
    }

    setParams(){

    }
}

