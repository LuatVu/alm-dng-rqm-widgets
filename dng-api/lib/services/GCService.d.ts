export declare class GCService {
    getGCStream(url: string, uri: string): import("rxjs").Observable<any>;
    getStreamFromBaseline(url: string, configId: string): import("rxjs").Observable<unknown>;
    getBaselineFromStream(url: string, configId: string): import("rxjs").Observable<unknown>;
    getBaselineDetail(url: string, body: any): import("rxjs").Observable<unknown>;
    getStreamDetail(url: string): import("rxjs").Observable<unknown>;
    getMetaDataResponse(url: string): import("rxjs").Observable<unknown>;
    createStageBaseline(url: string, paramArg: any): import("rxjs").Observable<unknown>;
    updateLstBaseline(url: string, body: string, etag: string): import("rxjs").Observable<unknown>;
}
