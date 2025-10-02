import type { AxiosInstance, AxiosRequestConfig } from 'axios';

// 初始化HTTP客户端
export function initHttpClient(httpInstance: AxiosInstance): void {
  console.log('Initializing HTTP client...', httpInstance);
  (globalThis as any).globalHttpInstance = httpInstance;
}

// 获取HTTP实例
export function getHttpInstance(): AxiosInstance {
  if (!(globalThis as any).globalHttpInstance) {
    throw new Error('HTTP客户端未初始化，请先调用 initHttpClient() 方法');
  }
  return (globalThis as any).globalHttpInstance;
}

// HTTP请求方法的类型定义
export type RequestMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

// 通用请求函数
export function request<T>(
  method: RequestMethods,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const http = getHttpInstance();
  return http.request<T>({
    method,
    url,
    ...config
  }).then(response => response as T);
}

export const http = {
    get: <T, R = any>(url: string, config?: AxiosRequestConfig<R>) =>
        request<T>('get', url, config),
    post: <T, R = any>(url: string, config?: AxiosRequestConfig<R>) =>
        request<T>('post', url, config),
    put: <T, R = any>(url: string, config?: AxiosRequestConfig<R>) =>
        request<T>('put', url, config),
    delete: <T, R = any>(url: string, config?: AxiosRequestConfig<R>) =>
        request<T>('delete', url, config),
    patch: <T, R = any>(url: string, config?: AxiosRequestConfig<R>) =>
        request<T>('patch', url, config),
    request,
}