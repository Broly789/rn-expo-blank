// request.js
import { buildUrl } from './index'

const request = async (url, options = {}) => {
  const { method = 'GET', params, body, reqConfig = {} } = options

  // 接口基础地址（从环境变量取）
  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  const requestUrl = buildUrl(apiUrl, url, params)
  console.log(requestUrl)

  // 请求头
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 待完成：在这里加 Authorization token
  }

  // 组装 fetch 配置
  const config = {
    method,
    headers,
    ...reqConfig,
  }

  // 如果有 body，转成 JSON 字符串
  if (body) {
    config.body = JSON.stringify(body)
  }

  // 如果有 signal，就传给 fetch
  if (options.signal) {
    config.signal = options.signal
  }

  // 发送请求
  const response = await fetch(requestUrl, config)

  // 错误处理
  if (!response.ok) {
    let errorData = {}
    try {
      errorData = await response.json()
    } catch (e) {
      // 解析失败就空对象
    }
    const error = new Error(errorData.message || 'Request failed')
    error.status = response.status
    error.errors = errorData.errors
    throw error
  }

  // 返回 JSON 数据
  return await response.json()
}

export default request

/** GET 请求 */
export const get = (url, params, reqConfig) =>
  request(
    url,
    {
      method: 'GET',
      params,
    },
    reqConfig,
  )

/** POST 请求 */
export const post = (url, body) =>
  request(url, {
    method: 'POST',
    body,
  })

/** PUT 请求 */
export const put = (url, body) =>
  request(url, {
    method: 'PUT',
    body,
  })

/** PATCH 请求 */
export const patch = (url, body) =>
  request(url, {
    method: 'PATCH',
    body,
  })

/** DELETE 请求 */
export const del = (url) =>
  request(url, {
    method: 'DELETE',
  })
