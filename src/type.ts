export type Method =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace"
  | "connect"
  | string;

type RequestOptions = {
  [key: string]: any;
  url: string;
  method: Method;
  params?: any;
  data?: any;
};

export type ApiQuery = Record<string, number | string | boolean | null>;
export type ApiPath = Record<string, number | string | boolean | null>;

export type ApiParams = {
  query?: ApiQuery;
  path?: ApiPath;
  data?: Record<string,any>;
};
type apiFunction = (param?: ApiParams, options?: Record<string,any>) => Promise<any>;

export interface HttpClient {
  [key: string]: any;
  request: (options: RequestOptions) => Promise<any>;
}

export interface ApiConfig {
  [key: string]: string | ApiConfig;
}

export interface Api {
  [key: string]: apiFunction | Api;
}
