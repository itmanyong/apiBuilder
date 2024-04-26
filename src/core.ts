import {
  HttpClient,
  ApiConfig,
  ApiQuery,
  ApiPath,
  ApiParams,
  Method,
} from "./type";
import { flattenObject } from "./helper";
import { set, isPlainObject } from "lodash-es";

export class SuperAPiBuilder {
  private apiConfig: ApiConfig = {};
  private apiMap: Record<string, string> = {};
  private http: HttpClient | null = null;
  private methods: Method[] = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "head",
    "options",
    "trace",
    "connect",
  ];
  api: any = {};
  constructor(http: HttpClient, apiConfig: ApiConfig) {
    this.setApiConfig(apiConfig);
    this.setHttp(http);
  }
  setMethod(methods: string[]) {
    if (!methods.length) return;
    this.methods.push(...methods);

    Object.entries(this.apiMap)
      .filter(([_, path]) => methods.some((method) => path.startsWith(method)))
      .forEach(([name, path]) => this.setApi(name, path));
  }
  setHttp(http: HttpClient) {
    this.http = http;
  }
  setApiConfig(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
    const apiMap = flattenObject(apiConfig);
    Object.entries(apiMap).forEach(([name, path]) => this.setApi(name, path));
  }
  setApi(pathname: string, api: string) {
    set(this.apiConfig, pathname, api);
    const hasMethod = this.methods.some((method) => api.startsWith(method));
    this.apiMap[pathname] = (hasMethod ? "" : "get ") + api;
    this.generateApi(pathname);
  }
  getApi(pathname: string) {
    return this.api[pathname];
  }
  getUrl(pathname: string, query?: ApiQuery, path?: ApiPath): string {
    const apiConfig = this.apiMap[pathname];
    if (!apiConfig) {
      throw new Error(`api ${pathname} is not exist`);
    }
    const that = this;
    const reg = /:(\w+\|?\w+(=\w+)?)|(\{\w+\|?\w+(=\w+)?\})/g;
    const [pathStr, queryStr] = apiConfig.split(" ").at(1)?.split("?") || [];
    const [urlPath, urlQuery] = [
      { str: pathStr, data: path },
      { str: queryStr, data: query },
    ].map(({ str, data }, index) => {
      return str?.replace(reg, (match: string): string => {
        const mappingKey = match.toString().replace(/[:{}]/g, "");
        const [fieldStr, defaultValue = ""] = mappingKey.split("=");
        const fieldArr = fieldStr.split("|");
        if (!fieldArr.length) return "";
        return fieldArr.reduce((acc, field) => {
          // 路径参数校验
          if (
            (!data || data[field] === undefined) &&
            index === 0 &&
            !defaultValue
          ) {
            that.throwError(`路径参数 ${field} 缺失,URL=${str}`);
          }
          if (data && data[field] !== undefined) {
            acc = data[field]?.toString() || defaultValue || "";
          }
          return acc;
        }, defaultValue);
      });
    });
    return encodeURI(urlPath + (urlQuery ? `?${urlQuery}` : ""));
  }
  getData(pathname: string, data?: Record<string, any>) {
    if (!data) return null;
    if (!isPlainObject(data)) return isPlainObject || null;
    const apiConfig = this.apiMap[pathname];
    const dataTemp = apiConfig.split(" ").at(2);
    const dataSet =
      dataTemp
        ?.replace(/^\{|\}$/, "")
        ?.split(",")
        .map((item) => {
          const [field, defaultValue = ""] = item.split("=");
          return { field, defaultValue };
        }) || [];
    return dataSet.reduce(
      (acc: Record<string, any>, { field, defaultValue }) => {
        acc[field] = defaultValue;
        if (data[field] !== undefined) {
          acc[field] = data[field];
        }
        return acc;
      },
      {}
    );
  }
  private throwError(message: string) {
    throw new Error(message);
  }
  private generateApi(pathname: string) {
    const apiPath = this.apiMap[pathname];
    const [method, _, dataTemp] = apiPath.split(" ");
    const that = this;
    set(
      this.api,
      pathname,
      (params: ApiParams, options?: Record<string, any>) => {
        const { query, path, data: _data } = params || {};
        const url = that.getUrl(pathname, query, path);
        const data = that.getData(dataTemp, _data);
        const sendParams = {
          ...(options || {}),
          url,
          method,
          data,
        };
        return that.http?.request(sendParams);
      }
    );
  }
}