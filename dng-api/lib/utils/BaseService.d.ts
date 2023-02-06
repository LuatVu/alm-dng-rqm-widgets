import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/internal/observable/dom/AjaxObservable';
import { RequestModel } from './Request';
export declare class BaseService {
    private headers;
    private baseHeader;
    private params;
    private createRequest;
    getMetaData<T>(request: RequestModel): Observable<T | string | null>;
    getRequest<T>(url: string, params?: any, responseType?: string, handleResponse?: boolean): Observable<AjaxResponse | T | null>;
    getMetaDataResponse<T>(url: string, params?: any, responseType?: string, handleResponse?: boolean): Observable<string | T | null>;
    postRequest<T>(url: string, params?: any, body?: any, responseType?: string, handleResponse?: boolean): Observable<AjaxResponse | T | null>;
    putRequest<T>(url: string, body: any, responseType?: string, handleResponse?: boolean): Observable<AjaxResponse | T | null>;
    private handleResponse;
    private handleError;
    setHeader(header: any): void;
    setParams(): void;
}
