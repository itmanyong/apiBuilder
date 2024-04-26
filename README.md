## 接口函数生成器

### 1. 介绍

一键生成已配置的各种接口函数，统一的调用模式减少心智负担，提高开发效率。再也不用一个接口一个接口的去写调用函数、查看函数使用方法了

### 2. 特性

* `接口定义`通过静态配置的方式进行管理，支持`无限极嵌套`
* `调用路径`严格遵守目录文件结构，见路径即知调用方法
* `参数特性`支持`默认值`、`同位多字段`
* `参数类型`支持`路径参数`、`查询参数`、`请求体参数`
* `参数格式`支持`:id`、`{id}`两种范式
* `请求类型`无限制支持请求实例的所有类型
* `请求实例`无限制支持自主配置
* `URL编码`将自动编码为`URL`格式
* `完全可配置`将完全暴露请求实例方法的所有参数，无缺失
* `调用统一`所有接口统一调用方式、传参方式、配置方式

### 3. 使用

* `安装`

```shell
# pnpm
pnpm add @cxy/api-builder
# npm
npm install @cxy/api-builder
# yarn
yarn add @cxy/api-builder
```

* `配置`

```javascript
import {
    ApiBuilder
} from '@cxy/api-builder'
/**
 * @param {Object} http 必须 axios实例 = 含有request方法的对象
 * @param {Object} apiConfig 可选 接口配置对象
 * @returns {Class} api 接口函数生成器实例
 */
const apiInstance = new ApiBuilder(http, apiConfig)
```

* `调用`

```javascript
/**
 * @param {Object} paramObject 可选 参数对象={query:{},data:{},path:{}}
 * @param {Object} requestOptions 可选 请求配置对象
 */
apiInstance.api[.pathName].fnName(paramObject, requestOptions)
```

### 4. 签名

* `ApiBuilder(http, apiConfig) => apiInstance`
    - `http`：必须 axios实例 = 含有request方法的对象
    - `apiConfig`：可选 接口配置对象
    - `apiInstance`：接口函数生成器实例
* `apiInstance.api[.pathName].fnName(paramObject, requestOptions)`
    - `pathName`：路径名
    - `fnName`：函数名
    - `paramObject`：可选 参数对象={query:{},data:{},path:{}}
    - `requestOptions`：可选 请求配置对象
* `api接口定义`:`method path data`
    - `method`：请求方法
    - `path`：请求路径,包括路径参数、查询参数
    - `data`：请求体参数
* `api接口定义`：`method`
    - 支持`get|post|put|delete|patch|head|options`等http.request支持的所有方法
    - 最好小写
* `api接口定义`：`path`
    - 支持`/path/:id|key=123`、`/path/{id:key=123}`两种格式
    - `:id`：路径参数
    - `{id}`：查询参数
    - `|`：同位多字段
    - `=123`：默认值
* `api接口定义`：`data`
    - 仅支持`{name,age,sex=0}`格式
    - 支持`=`配置默认值

### 5. 解析/示例

* 实例化：第一个参数：http实例

```javascript
// 1.可以是直接的axios实例
import axios from 'axios'
const http = axios.create({})
// 2.也可以是含有request方法的对象
const http = {
    request: axios.request
}
```

* 实例化：第二个参数：api配置对象

```javascript
const apiConfig = {
    login: `post /login {username,password}`,
    users: {
        item: `/users/:id`,
        page: `/users/page?page={page=1}&size=:size=20`,
        list: `/users/list/{size=20}?name={name}&age=:age&tel=:tel|phone&sex={sex|mode=0}`,
        create: `post /users {name,age,tel,sex=0}`,
        update: `put /users/:id {name,age,tel,sex}`,
        delete: `delete /users/:id`
    }
}
```

* 调用：第一个参数：paramObject
* query: 查询参数：`{query:{key:value}}`：对应配置的URL问号后的参数
* data: 请求体参数：`{data:{key:value}}`：对应配置的请求体参数
* path: 路径参数：`{path:{key:value}}`：对应配置的URL问号前的参数

* 调用：第二个参数：requestOptions
* `http实例`的`request`方法的所有参数配置对象，例如headers、timeout等

### 6. 推荐案例

* 基于`vite`, 其他亦同理
* 所有接口定义放置在根目录下的`apis/services`等自定义名称文件夹下
* 内建文件`index.ts`文件
* 内建其他接口定义文件，例如`users.ts`、`./auth/role.ts`等

```typescript
import { ApiBuilder } from '@cxy/api-builder'
import { httpInstance } from 'xx/xx/http.ts'
import {set as _set} from 'lodash-es'
// 自动导入当前目录下所有接口定义文件，排除index.ts
const apiMap = import.meta.glob(['./**/*.ts','./**/index.ts'],{eager:true})
// 接口定义配置
const apiConfig={}
// 读取接口定义配置
for (const path in apiMap) {
    if (path.includes('index.ts')) continue
    const apiConfigItem = apiMap[path].default()
    // 注意!!!这里的apis/是当前文件所处的目录名称，根据实际情况修改
    const apiNamePath = path.split('apis/')[1].replace('.ts','').join('.')
    _set(apiConfig,apiNamePath,apiConfigItem)
}
// 创建api接口函数实例
export const apiInstance = new ApiBuilder(httpInstance, apiConfig)
// 对外直接导出接口函数
export const apis = apiInstance.api
```

* 接口定义文件示例，例如`users.ts`

```typescript
export default function (){
    return {
        item: `/users/:id`,
        page: `/users/page?page={page=1}&size=:size=20`,
        list: `/users/list/{size=20}?name={name}&age=:age&tel=:tel|phone&sex={sex|mode=0}`,
        create: `post /users {name,age,tel,sex}`,
        update: `put /users/:id {name,age,tel,sex}`,
        delete: {
            item:`delete /users/:id`,
            list:`post /users/list {ids=[]}`
        },
    }
}
```
