export interface RequestModel {
    url: string;
    body?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: object;
    params?: any;
    handleResponse: boolean;
    responseType: string;
}
