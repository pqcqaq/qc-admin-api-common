// WebSocket 消息类型定义
export interface ClientMessage {
  action: "subscribe" | "unsubscribe" | "ping" | "pong" | "msg" | "channel_start" | "channel" | "channel_close";
  topic: string;
  data?: string;
}

// 服务器发送的消息类型
export interface SocketMessagePayload {
  topic: string;
  action?: "init"
  userId: number;
  data: any;
  timestamp?: number;
}

export interface SocketActionPayload {
  action: "connected";
}

// 消息处理器类型
export type MessageHandler<T = any> = (data: T, topic: string) => void;

// WebSocket 连接状态
export enum WebSocketState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  ERROR = "error"
}

// 订阅配置
export interface SubscriptionConfig {
  topic: string;
  handler: MessageHandler;
}

// WebSocket 适配器接口
export interface IWebSocketAdapter {
  /** 连接 WebSocket */
  connect(url: string): Promise<void>;
  
  /** 发送消息 */
  send(data: string | ArrayBuffer): void;
  
  /** 关闭连接 */
  close(code?: number, reason?: string): void;
  
  /** 连接状态 */
  readonly readyState: number;
  
  /** 监听连接打开事件 */
  onOpen(callback: () => void): void;
  
  /** 监听消息接收事件 */
  onMessage(callback: (data: string | ArrayBuffer) => void): void;
  
  /** 监听连接关闭事件 */
  onClose(callback: (code: number, reason: string) => void): void;
  
  /** 监听错误事件 */
  onError(callback: (error: any) => void): void;
}

// WebSocket 连接选项
export interface SocketOptions {
  url?: string;
  token?: string;
  heartbeatInterval?: number;
  debug?: boolean;
  /** WebSocket 适配器实例 */
  adapter: IWebSocketAdapter;
  refreshToken?: () => Promise<Required<SocketOptions>["token"]>;
  errorHandler?: (msg: ErrorMsg['data']) => void;
}

// 取消订阅函数类型
export type UnsubscribeFunction = () => void;

// channel 相关
export type ChannelSender<T> = (data: T) => void;
export type ChannelMessageHandler<T> = (data: T) => void;
export type ChannelCloser = () => void;
export type ChannelCloseHandler = (reason: ErrorMsgData['error']) => void;
export type ErrorMsgData = {
  code: string;
  detail: string;
  error: {
    code: string;
    detail: string;
  }
}

export interface Channel<T> {
  id: string;
  topic: string;

  send<T>(data: T): void;
  read<T>(): Promise<T>;
  close(): void;
  isClosed(): boolean;
}

// WebSocket 实例接口
export interface ISocketClient {
  // 连接状态
  readonly state: WebSocketState;

  // 连接方法
  connect(token?: string): Promise<void>;

  // 断开连接
  disconnect(): void;

  // 订阅主题
  subscribe<T = any>(
    topic: string,
    handler: MessageHandler<T>,
    errHandler?: (err: ErrorMsg['data']) => void
  ): UnsubscribeFunction;

  // 取消订阅
  unsubscribe(topic: string, handler?: MessageHandler): void;

  // 取消所有订阅
  unsubscribeAll(): void;

  // 监听连接状态变化
  onStateChange(callback: (state: WebSocketState) => void): () => void;

  // 发送消息
  sendMessage(topic: string, data?: any): void;

  // 开启一个channel
  createChannel<S, R>(topic: string, handler: ChannelMessageHandler<R>, errHandler?: ChannelCloseHandler): Promise<{
    send: ChannelSender<S>;
    close: ChannelCloser;
    onClose: (handler: ChannelCloseHandler) => void;
    channelId: string;
  }>;

  // 监听服务器创建的channel
  registerChannelOpen<T>(topic: string, handler:(channel: Channel<T>) => void): UnsubscribeFunction;
}

// 内部订阅记录
export interface SubscriptionRecord {
  topic: string;
  handler: MessageHandler;
  init?: MessageHandler<any[]>;
  id: string;
}

export type DisConnectMsg = {
  topic: "?dc";
  data: {
    code: string;
    detail: string;
  }
}

export type ErrorMsg = {
  topic: "?er";
  data: {
    code: string;
    detail: string;
  }
}

export type CreateMsg = {
  topic: "?cr";
  data: {
    topic: string;
  }
}

export type ChannelCreateRes = {
  channelId?: string;
  error?: ErrorMsgData['error']
}

export type SubsRes = {
  success?: boolean;
  error?: ErrorMsgData['error']
}