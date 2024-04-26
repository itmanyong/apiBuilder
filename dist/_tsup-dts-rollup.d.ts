import { Options } from 'tsup';

export declare interface Api {
    [key: string]: apiFunction | Api;
}

export declare interface ApiConfig {
    [key: string]: string | ApiConfig;
}

declare type apiFunction = (param?: ApiParams, options?: Record<string, any>) => Promise<any>;

export declare type ApiParams = {
    query?: ApiQuery;
    path?: ApiPath;
    data?: Record<string, any>;
};

export declare type ApiPath = Record<string, number | string | boolean | null>;

export declare type ApiQuery = Record<string, number | string | boolean | null>;

export declare const default_alias: Options | Options[] | ((overrideOptions: Options) => Options | Options[] | Promise<Options | Options[]>);

/**
 * 将对象扁平化
 * @param {Object} obj 需要扁平化的对象
 * @param {String|null} parentKey 父级key
 * @returns {Object} 返回扁平化后的对象
 */
export declare function flattenObject(obj: {
    [key: string]: any;
}, parentKey?: string): {
    [key: string]: any;
};

export declare interface HttpClient {
    [key: string]: any;
    request: (options: RequestOptions) => Promise<any>;
}

export declare type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "trace" | "connect" | string;

declare type RequestOptions = {
    [key: string]: any;
    url: string;
    method: Method;
    params?: any;
    data?: any;
};

declare class SuperAPiBuilder {
    private apiConfig;
    private apiMap;
    private http;
    private methods;
    api: any;
    constructor(http: HttpClient, apiConfig: ApiConfig);
    setMethod(methods: string[]): void;
    setHttp(http: HttpClient): void;
    setApiConfig(apiConfig: ApiConfig): void;
    setApi(pathname: string, api: string): void;
    getApi(pathname: string): any;
    getUrl(pathname: string, query?: ApiQuery, path?: ApiPath): string;
    getData(pathname: string, data?: Record<string, any>): Record<string, any> | ((value?: any) => boolean) | null;
    private throwError;
    private generateApi;
}
export { SuperAPiBuilder }
export { SuperAPiBuilder as SuperAPiBuilder_alias_1 }

export { }
