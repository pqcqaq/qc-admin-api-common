// 引入 uniapp 类型定义
/// <reference types="@dcloudio/types" />

import type { IWebSocketAdapter, AdapterOptions } from "./types";
import { WebSocketReadyState } from "./types";

declare const uni: UniApp.Uni;

/**
 * UniApp WebSocket 适配器
 * 基于 uni.connectSocket API 实现
 */
export class UniAppWebSocketAdapter implements IWebSocketAdapter {
  private socketTask: UniApp.SocketTask | null = null;
  private _readyState = WebSocketReadyState.CLOSED;
  private openCallback: (() => void) | null = null;
  private messageCallback: ((data: string | ArrayBuffer) => void) | null = null;
  private closeCallback: ((code: number, reason: string) => void) | null = null;
  private errorCallback: ((error: any) => void) | null = null;
  private debug = false;

  constructor(options?: AdapterOptions) {
    this.debug = options?.debug ?? false;
  }

  public get readyState(): WebSocketReadyState {
    return this._readyState;
  }

  public async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._readyState = WebSocketReadyState.CONNECTING;

        this.socketTask = uni.connectSocket({
          url,
          complete: () => {
            // 连接完成回调（成功或失败都会执行）
          }
        });
          
        if (!this.socketTask) {
          throw new Error("Failed to create WebSocket connection, please check the url when using apps.");
        }

        // 监听连接打开事件
        this.socketTask.onOpen(() => {
          this.log("WebSocket connected");
          this._readyState = WebSocketReadyState.OPEN;
          if (this.openCallback) {
            this.openCallback();
          }
          resolve();
        });

        // 监听消息接收事件
        this.socketTask.onMessage((res) => {
          this.log("Received message:", res.data);
          if (this.messageCallback) {
            this.messageCallback(res.data);
          }
        });

        // 监听连接关闭事件
        this.socketTask.onClose((res) => {
          this.log(`WebSocket closed: ${res.code} ${res.reason}`);
          this._readyState = WebSocketReadyState.CLOSED;
          if (this.closeCallback) {
            this.closeCallback(res.code || 1000, res.reason || "");
          }
        });

        // 监听错误事件
        this.socketTask.onError((error) => {
          this.log("WebSocket error:", error);
          this._readyState = WebSocketReadyState.CLOSED;
          if (this.errorCallback) {
            this.errorCallback(error);
          }
          reject(new Error("WebSocket connection failed"));
        });
      } catch (error) {
        this._readyState = WebSocketReadyState.CLOSED;
        reject(error);
      }
    });
  }

  public send(data: string | ArrayBuffer): void {
    if (this.socketTask && this._readyState === WebSocketReadyState.OPEN) {
      this.socketTask.send({
        data: data as string, // UniApp 主要支持字符串数据
        success: () => {
          this.log("Sent message:", data);
        },
        fail: (error) => {
          this.log("Failed to send message:", error);
        }
      });
    } else {
      this.log("Cannot send message: WebSocket not connected");
    }
  }

  public close(code = 1000, reason = "Normal closure"): void {
    if (this.socketTask) {
      this._readyState = WebSocketReadyState.CLOSING;
      this.socketTask.close({
        code,
        reason,
        success: () => {
          this.log("WebSocket closed successfully");
          this._readyState = WebSocketReadyState.CLOSED;
        },
        fail: (error) => {
          this.log("Failed to close WebSocket:", error);
          this._readyState = WebSocketReadyState.CLOSED;
        }
      });
      this.socketTask = null;
    }
  }

  public onOpen(callback: () => void): void {
    this.openCallback = callback;
  }

  public onMessage(callback: (data: string | ArrayBuffer) => void): void {
    this.messageCallback = callback;
  }

  public onClose(callback: (code: number, reason: string) => void): void {
    this.closeCallback = callback;
  }

  public onError(callback: (error: any) => void): void {
    this.errorCallback = callback;
  }

  private log(message: string, ...args: any[]): void {
    if (this.debug) {
      console.log(`[UniAppWebSocketAdapter] ${message}`, ...args);
    }
  }
}

/**
 * 创建 UniApp WebSocket 适配器的工厂函数
 */
export function createUniAppAdapter(options: AdapterOptions = {}): IWebSocketAdapter {
  return new UniAppWebSocketAdapter(options);
}