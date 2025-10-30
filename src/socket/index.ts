import {
  type ISocketClient,
  type SocketOptions,
  type MessageHandler,
  type UnsubscribeFunction,
  type SubscriptionRecord,
  type ClientMessage,
  type SocketMessagePayload,
  type IWebSocketAdapter,
  WebSocketState,
  DisConnectMsg,
  ErrorMsg,
  ChannelMessageHandler,
  ChannelSender,
  ChannelCloseHandler,
  ChannelCloser,
  ChannelCreateRes,
  ErrorMsgData,
  SocketActionPayload,
  CreateMsg,
  Channel
} from "./types";
import { matchTopic } from "./topic";

export class Channeler<T> implements Channel<T> {
  id: string;
  topic: string;
  
  private queue: any[] = [];
  private resolvers: ((value: any) => void)[] = [];
  private rejecters: ((error: any) => void)[] = [];
  private closed = false;

  private sender: (msg: any) => void;
  private closer: () => void;

  constructor(id: string, topic: string, sender: (msg: any) => void, closer: () => void) {
    this.id = id;
    this.topic = topic;
    this.sender = sender;
    this.closer = closer;
  }

  // 生产者调用：发送数据
  send<T>(data: T): void {
    if (this.closed) {
      throw new Error(`Channel ${this.id} is closed`);
    }
    
    // 发送信息
    this.sender(data);
  }

  // 消费者调用：读取数据（阻塞）
  async read<T>(): Promise<T> {

    // 如果队列中有数据，直接返回
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }

    // 如果通道已关闭且队列为空，抛出错误或返回特殊值
    if (this.closed) {
      throw new Error(`Channel ${this.id} is closed and empty`);
    }

    // 创建 Promise 等待数据
    return new Promise<T>((resolve, reject) => {
      this.resolvers.push(resolve);
      this.rejecters.push(reject);
    });
  }

  // 关闭通道
  close(): void {
    if (this.closed) {
      return;
    }

    // 发送关闭信息
    this.closer();
  }

  // 内部方法：接收数据（由 send 调用）
  onReceive(data: any): void {
    // 如果有等待的读取者，直接 resolve
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift()!;
      this.rejecters.shift(); // 同时移除对应的 rejecter
      resolve(data);
    } else {
      // 否则放入队列
      this.queue.push(data);
    }
  }

  // 内部方法：关闭通道（由 close 调用）
  onClose(reason: ErrorMsgData['error']): void {
    this.closed = true;
    
    // 拒绝所有等待的读取者
    const closeError = new Error(`Channel ${this.id} is closed ${reason ? `: ${reason.code} ${reason.detail}` : ''}`);
    this.rejecters.forEach(reject => reject(closeError));
    this.resolvers = [];
    this.rejecters = [];
  }

  // 辅助方法：检查通道状态
  isClosed(): boolean {
    return this.closed;
  }

  // 辅助方法：获取队列长度
  size(): number {
    return this.queue.length;
  }
}

/**
 * WebSocket 客户端实现
 * 支持主题订阅、自动重连、消息分发等功能
 */
export class SocketClient implements ISocketClient {
  private adapter: IWebSocketAdapter;
  private _state: WebSocketState = WebSocketState.DISCONNECTED;
  private subscriptions: Map<string, SubscriptionRecord[]> = new Map();
  private topics: Map<string, SubscriptionRecord[]> = new Map();
  private stateChangeCallbacks: Set<(state: WebSocketState) => void> =
    new Set();

  private readonly options: Required<SocketOptions>;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  
  // 指数退避算法相关属性
  private currentBackoffDelay = 500; // 初始延迟 0.5 秒
  private readonly baseBackoffDelay = 500; // 基础延迟 0.5 秒
  private readonly maxBackoffDelay = 16000; // 最大延迟 16 秒
  private disSub: UnsubscribeFunction | null = null;
  
  // 用于区分是否为手动断开
  private isManualDisconnect = false;

  constructor(options: SocketOptions) {
    this.options = {
      url: options.url || "/ws",
      token: options.token || "",
      heartbeatInterval: options.heartbeatInterval ?? 30000,
      debug: options.debug ?? false,
      adapter: options.adapter,
      refreshToken: options.refreshToken || (() => Promise.resolve("")),
      errorHandler: options.errorHandler || (() => {})
    };

    this.adapter = this.options.adapter;
  }

  public get state(): WebSocketState {
    return this._state;
  }

  /**
   * 连接 WebSocket 服务器
   */
  public async connect(token?: string): Promise<void> {
    if (this._state === WebSocketState.CONNECTED) {
      this.log("Already connected");
      return;
    }

    if (this._state === WebSocketState.CONNECTING) {
      this.log("Already connecting");
      return;
    }

    const authToken = token || this.options.token;
    if (!authToken) {
      throw new Error("Token is required for WebSocket connection");
    }

    if (!this.options.url) {
      throw new Error("WebSocket URL is required");
    }

    // 重置手动断开标记
    this.isManualDisconnect = false;
    this.setState(WebSocketState.CONNECTING);

    if (this.disSub) {
      this.disSub();
    }
    this.disSub = this.selfSubs();

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.options.url}?token=${encodeURIComponent(
          authToken
        )}`;
        
        // 设置适配器的事件监听器
        this.adapter.onOpen(() => {
          this.log("WebSocket connected waiting for connected message...");
          this.resetBackoffDelay();
          this.startHeartbeat();
          this.resubscribeAll();
        });

        this.adapter.onMessage((data) => {
          this.handleMessage(data, (msg) => {
            if (msg.action === "connected") {
              this.setState(WebSocketState.CONNECTED);
              resolve();
            }
          });
        });

        this.adapter.onClose((code, reason) => {
          this.log(`WebSocket closed: ${code} ${reason}`);
          this.setState(WebSocketState.DISCONNECTED);
          this.stopHeartbeat();
          this.scheduleReconnect();
        });

        this.adapter.onError((error) => {
          this.log("WebSocket error:", error);
          this.setState(WebSocketState.ERROR);
          reject(new Error("WebSocket connection failed"));
        });
        
        // 开始连接
        this.adapter.connect(wsUrl).catch(reject);
      } catch (error) {
        this.setState(WebSocketState.ERROR);
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  public disconnect(): void {
    // 标记为手动断开
    this.isManualDisconnect = true;
    
    this.clearReconnectTimer();
    this.stopHeartbeat();

    this.adapter.close(1000, "Manual disconnect");
    this.setState(WebSocketState.DISCONNECTED);
  }

  /**
   * 订阅主题
   */
  public subscribe<T = any>(
    topic: string,
    handler: MessageHandler<T>,
    errHandler?: (err: ErrorMsg['data']) => void,
    init?: MessageHandler<any[]>
  ): UnsubscribeFunction {
    const id = this.generateId();
    const record: SubscriptionRecord = { topic, handler, id, init };
    const errRecord: SubscriptionRecord = { topic, handler: (data) => {
      this.log("Result handler invoked for topic:", topic);
      if (data.error && errHandler) {
        errHandler(data.error as ErrorMsg['data']);
      }
    }, id: id + "_res" };

    // 检查是否是该主题的第一个订阅
    const isFirstSubscription = !this.subscriptions.has(topic);

    // 保存订阅记录
    if (isFirstSubscription) {
      this.subscriptions.set(topic, []);
    }
    this.subscriptions.get(topic)!.push(record);

    if (errHandler) {
        this.subscriptions.get(topic)!.push(errRecord);
    }

    // 只有在第一次订阅该主题且已连接时，才发送订阅请求到服务器
    if (isFirstSubscription && this._state === WebSocketState.CONNECTED) {
      this.sendSubscribeMessage(topic);
    }

    this.log(
      `Try to topic: ${topic} (handlers: ${this.subscriptions.get(topic)!.length})`
    );

    // 返回取消订阅函数
    return () => {
      this.unsubscribeById(id);
      if (errHandler) {
        this.unsubscribeById(id + "_res");
      }
    };
  }

  /**
   * 取消订阅
   */
  public unsubscribe(topic: string, handler?: MessageHandler): void {
    const records = this.subscriptions.get(topic);
    if (!records) return;

    if (handler) {
      // 取消特定处理器的订阅
      const index = records.findIndex(record => record.handler === handler);
      if (index !== -1) {
        records.splice(index, 1);
        if (records.length === 0) {
          this.subscriptions.delete(topic);
          this.sendUnsubscribeMessage(topic);
        }
      }
    } else {
      // 取消该主题的所有订阅
      this.subscriptions.delete(topic);
      this.sendUnsubscribeMessage(topic);
    }

    this.log(`Unsubscribed from topic: ${topic}`);
  }

  /**
   * 取消所有订阅
   */
  public unsubscribeAll(): void {
    for (const topic of this.subscriptions.keys()) {
      this.sendUnsubscribeMessage(topic);
    }
    this.subscriptions.clear();
    this.log("Unsubscribed from all topics");
  }

  /**
   * 监听连接状态变化
   */
  public onStateChange(callback: (state: WebSocketState) => void): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => {
      this.stateChangeCallbacks.delete(callback);
    };
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(data: string | ArrayBuffer, actionCallback: (msg: SocketActionPayload) => void): void {
    try {
      const messageData = typeof data === 'string' ? data : new TextDecoder().decode(data);
      const message: SocketMessagePayload = JSON.parse(messageData);
      if (Object.prototype.hasOwnProperty.call(message, "action")) {
        actionCallback(message as any as SocketActionPayload);
        if (message.action !== "init") {
          return;
        }
      }
      
      this.log("Received message:", message);

      // 获取所有订阅的主题
      const subscribedTopics = Array.from(this.subscriptions.keys());

      // 找到匹配的订阅并分发消息
      for (const subscribedTopic of subscribedTopics) {
        if (matchTopic(subscribedTopic, message.topic)) {
          const records = this.subscriptions.get(subscribedTopic);
          if (records) {
            for (const record of records) {
              try {
                if (message.action === "init" && record.init) {
                  record.init(message.data as any[], message.topic);
                  continue;
                }
                record.handler(message.data, message.topic);
              } catch (error) {
                this.log("Error in message handler:", error);
              }
            }
          }
        }
      }
    } catch (error) {
      this.log("Error parsing message:", error);
    }
  }

  /**
   * 发送订阅消息到服务器
   */
  private sendSubscribeMessage(topic: string): void {
    const message: ClientMessage = {
      action: "subscribe",
      topic
    };
    this.sendMessageInner(message);
  }

  /**
   * 发送取消订阅消息到服务器
   */
  private sendUnsubscribeMessage(topic: string): void {
    const message: ClientMessage = {
      action: "unsubscribe",
      topic
    };
    this.sendMessageInner(message);
  }

  /**
   * 发送消息到服务器
   */
  private sendMessageInner(message: ClientMessage): void {
    if (this.adapter.readyState === 1) { // OPEN
      this.adapter.send(JSON.stringify(message));
      this.log("Sent message:", message);
    } else {
      this.log("Cannot send message: WebSocket not connected");
    }
  }

  /**
   * 发送消息到服务器
   */
  public sendMessage(topic: string, data?: any): void {
    const message: ClientMessage = {
      action: "msg",
      topic,
      data: data || {}
    };
    this.sendMessageInner(message);
  }

  /**
   * 重新订阅所有主题（用于重连后）
   */
  private resubscribeAll(): void {
    for (const topic of this.subscriptions.keys()) {
      this.sendSubscribeMessage(topic);
    }
  }

  /**
   * 设置连接状态
   */
  private setState(state: WebSocketState): void {
    if (this._state !== state) {
      this._state = state;
      this.log(`State changed to: ${state}`);
      for (const callback of this.stateChangeCallbacks) {
        try {
          callback(state);
        } catch (error) {
          this.log("Error in state change callback:", error);
        }
      }
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    // 如果是手动断开，则不进行重连
    if (this.isManualDisconnect) {
      this.log("Manually disconnected, not scheduling reconnect");
      return;
    }

    this.setState(WebSocketState.RECONNECTING);

    this.reconnectTimer = setTimeout(() => {
      this.log(`Attempting to reconnect (delay: ${this.currentBackoffDelay}ms)`);
      this.connect().catch(error => {
        this.log("Reconnect failed:", error);
        this.increaseBackoffDelay();
      });
    }, this.currentBackoffDelay);
  }

  /**
   * 清除重连定时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 开始心跳
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.adapter.readyState === 1) { // OPEN
        // 发送心跳消息（可以是空的订阅消息）
        this.sendMessageInner({ action: "ping", topic: "" });
      }
    }, this.options.heartbeatInterval);
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 根据ID取消订阅
   */
  private unsubscribeById(id: string): void {
    for (const [topic, records] of this.subscriptions.entries()) {
      const index = records.findIndex(record => record.id === id);
      if (index !== -1) {
        records.splice(index, 1);
        if (records.length === 0) {
          this.subscriptions.delete(topic);
          this.sendUnsubscribeMessage(topic);
        }
        this.log(`Unsubscribed by ID: ${id} from topic: ${topic}`);
        break;
      }
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 增加退避延迟时间（指数退避）
   */
  private increaseBackoffDelay(): void {
    this.currentBackoffDelay = Math.min(
      this.currentBackoffDelay * 2,
      this.maxBackoffDelay
    );
    this.log(`Backoff delay increased to: ${this.currentBackoffDelay}ms`);
  }

  /**
   * 重置退避延迟时间
   */
  private resetBackoffDelay(): void {
    this.currentBackoffDelay = this.baseBackoffDelay;
    this.log(`Backoff delay reset to: ${this.currentBackoffDelay}ms`);
  }

  /**
   * 日志输出
   */
  private log(message: string, ...args: any[]): void {
    if (this.options.debug) {
      console.log(`[SocketClient] ${message}`, ...args);
    }
  }

  private selfSubs(): UnsubscribeFunction {
    const fn1 = this.subscribe<DisConnectMsg["data"]>("?dc", (message) => {
      this.log("[SocketClient] Received disconnect message:", message);
      if (message?.code === "TOKEN_EXPIRED") {
        this.disconnect();
        this.log("Disconnected due to token expiration");
        this.options.refreshToken?.().then((newToken) => {
          if (!newToken) {
            this.log("No new token obtained, cannot reconnect");
            return;
          }
          this.log("Token refreshed, reconnecting...");
          this.options.token = newToken;
          this.connect(newToken).catch((error) => {
            this.log("Reconnection failed:", error);
          });
        }).catch((error) => {
          this.log("Failed to refresh token:", error);
        });
      }
    })

    const fn2 = this.subscribe<ErrorMsg['data']>("?er", (message) => {
      this.log("[SocketClient] Received error message:", message);
      this.options.errorHandler?.(message);
    })

    const fn3 = this.subscribe<CreateMsg['data']>("?cr/#", (message) => {
      // 获取所有订阅的主题
      const subscribedTopics = Array.from(this.topics.keys());
            // 找到匹配的订阅并分发消息
      for (const subscribedTopic of subscribedTopics) {
        if (matchTopic(subscribedTopic, message.topic)) {
          const records = this.topics.get(subscribedTopic);
          if (records) {
            for (const record of records) {
              const t = async () => {
                try {
                  let newChannel: Channeler<any> | null = null;
                  const {send, close, onClose, channelId} = await this.createChannel(message.topic, (msg) => {
                    if (newChannel) {
                        newChannel.onReceive(msg);
                      }
                  })
                  onClose(err => {
                    if (newChannel) {
                      newChannel.onClose(err);
                    }
                  })
                  newChannel = new Channeler(channelId, message.topic, send, close);
                  record.handler(newChannel, message.topic);
                } catch (error) {
                  this.log("Error in create channel handler:", error);
                }
              }
              t()
            }
          }
        }
      }
    })

    return () => {
      fn1();
      fn2();
      fn3();
    }
  }

  public registerChannelOpen<T>(topic: string, handler: (channel: Channel<T>) => void): UnsubscribeFunction {
    const subsId = this.generateId();
    const record: SubscriptionRecord = {
      topic,
      handler,
      id: subsId,
    }

    const isFirst = !this.topics.has(topic);
    if (isFirst) {
      this.topics.set(topic, []);
    }
    this.topics.get(topic)!.push(record);
    
    return () => {
      const records = this.topics.get(topic);
      if (!records) return;

      const index = records.findIndex(r => r.id === subsId);
      if (index !== -1) {
        records.splice(index, 1);
        if (records.length === 0) {
          this.topics.delete(topic);
        }
      }
      this.log(`Unregistered channel open handler for topic: ${topic}`);
    }
  }

  public createChannel<S, R>(topic: string, handler: ChannelMessageHandler<R>, errHandler?: ChannelCloseHandler):
    Promise<{
      send: ChannelSender<S>;
      close: ChannelCloser;
      onClose: (handler: ChannelCloseHandler) => void; 
      channelId: string;
    }> {
    return new Promise((resolve, reject) => {
      let tryCount = 0;
      const maxTry = 100;
      let channelId: string | undefined = undefined;
      let error: ErrorMsgData['error'] | undefined = undefined;

      const handleChannelMsg = (res: ChannelCreateRes) => {
        if (res.error) {
          this.log("Channel creation error:", res.error);
          error = res.error;
          return;
        }
        if (res.channelId) {
          channelId = res.channelId;
          this.log(`Channel created with ID: ${channelId}`);
        }
      }

      const cr = this.subscribe<ChannelCreateRes>(`${topic}.cre`, handleChannelMsg);
      const message: ClientMessage = {
        action: "channel_start",
        topic
      };
      this.sendMessageInner(message);

      const handleSuccess = () => {
        this.log("Handling successful channel creation");
        const unHandler = this.subscribe<R>(channelId!, handler);
        const er = this.subscribe<ErrorMsgData>(`${channelId}.err`, (msg) => errHandler?.(msg.error));

        const send = (data: any) => {
          this.sendMessageInner({
            action: "channel",
            topic: channelId!,
            data
          })
        }

        const close = () => {
          this.sendMessageInner({
            action: "channel_close",
            topic: channelId!
          })
          if (er) er();
          unHandler();
          this.unsubscribe(channelId!);
        }

        let closeHandler: ChannelCloseHandler | null = null;

        const setCloseHandler = (handler: ChannelCloseHandler) => {
          closeHandler = handler;
        }

        // 订阅关闭消息
        const unsubClose = this.subscribe<ErrorMsgData>(`${channelId}.clo`, (msg) => {
          if (closeHandler) {
            closeHandler(msg);
          }
          unsubClose();
          if (er) er();
          unHandler();
          this.unsubscribe(channelId!);
        })
        
        resolve({
          channelId: channelId!,
          send,
          close,
          onClose: setCloseHandler
        });
      }

      // 每隔100ms检查一次是否收到channelId，最多检查30次
      const interval = setInterval(() => {
        if (channelId) {
          clearInterval(interval);
          cr();
          handleSuccess();
        }
        if (error) {
          clearInterval(interval);
          cr();
          reject(new Error(`Channel creation failed: ${error.code} ${error.detail}`));
        }
        if (tryCount >= maxTry) {
          clearInterval(interval);
          cr();
          reject(new Error("Channel creation timed out"));
        }
        tryCount++;
      }, 100)
    })
  }
}

// 导出类型
export * from "./types";
export * from "./topic";
