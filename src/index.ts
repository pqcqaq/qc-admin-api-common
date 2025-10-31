// 导出HTTP客户端初始化和配置
export { initHttpClient, getHttpInstance, request } from './http';

// 设置客户端代码的全局函数
export function setClientCode(clientCode: string): void {
  (globalThis as any).VITE_CLIENT_CODE = clientCode;
}

export function getClientCode(): string {
  return (globalThis as any).VITE_CLIENT_CODE || '';
}

export interface IBaseResponse<T = any> {
  success: boolean
  code?: number | string
  message?: string
  data: T
}

export type Pagination = {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总记录数 */
  total: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
};

export type SimpleResponseData<T> = {
  data: T
  success: boolean
}

// 导出 workflow 相关的类型和 API
export * from './workflow/types';
export * from './workflow/index';