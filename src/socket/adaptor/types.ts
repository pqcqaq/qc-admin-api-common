/**
 * WebSocket 适配器接口
 * 统一浏览器和 uniapp 环境的 WebSocket 操作
 */
export interface IWebSocketAdapter {
  /** 连接 WebSocket */
  connect(url: string): Promise<void>;
  
  /** 发送消息 */
  send(data: string | ArrayBuffer): void;
  
  /** 关闭连接 */
  close(code?: number, reason?: string): void;
  
  /** 连接状态 */
  readonly readyState: WebSocketReadyState;
  
  /** 监听连接打开事件 */
  onOpen(callback: () => void): void;
  
  /** 监听消息接收事件 */
  onMessage(callback: (data: string | ArrayBuffer) => void): void;
  
  /** 监听连接关闭事件 */
  onClose(callback: (code: number, reason: string) => void): void;
  
  /** 监听错误事件 */
  onError(callback: (error: any) => void): void;
}

/**
 * WebSocket 连接状态枚举
 */
export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

/**
 * 适配器创建选项
 */
export interface AdapterOptions {
  /** 调试模式 */
  debug?: boolean;
  /** 其他自定义选项 */
  [key: string]: any;
}

/**
 * 适配器工厂函数类型
 */
export type AdapterFactory = (options?: AdapterOptions) => IWebSocketAdapter;