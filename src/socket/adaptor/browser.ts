import type { IWebSocketAdapter, AdapterOptions } from "./types";
import { WebSocketReadyState } from "./types";

/**
 * 浏览器 WebSocket 适配器
 * 基于原生 WebSocket API 实现
 */
export class BrowserWebSocketAdapter implements IWebSocketAdapter {
  private ws: WebSocket | null = null;
  private openCallback: (() => void) | null = null;
  private messageCallback: ((data: string | ArrayBuffer) => void) | null = null;
  private closeCallback: ((code: number, reason: string) => void) | null = null;
  private errorCallback: ((error: any) => void) | null = null;
  private debug = false;

  constructor(options: AdapterOptions = {}) {
    this.debug = options.debug ?? false;
  }

  public get readyState(): WebSocketReadyState {
    if (!this.ws) return WebSocketReadyState.CLOSED;
    return this.ws.readyState as WebSocketReadyState;
  }

  public async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.log("WebSocket connected");
          if (this.openCallback) {
            this.openCallback();
          }
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.log("Received message:", event.data);
          if (this.messageCallback) {
            this.messageCallback(event.data);
          }
        };

        this.ws.onclose = (event) => {
          this.log(`WebSocket closed: ${event.code} ${event.reason}`);
          if (this.closeCallback) {
            this.closeCallback(event.code, event.reason);
          }
        };

        this.ws.onerror = (error) => {
          this.log("WebSocket error:", error);
          if (this.errorCallback) {
            this.errorCallback(error);
          }
          reject(new Error("WebSocket connection failed"));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public send(data: string | ArrayBuffer): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
      this.log("Sent message:", data);
    } else {
      this.log("Cannot send message: WebSocket not connected");
    }
  }

  public close(code = 1000, reason = "Normal closure"): void {
    if (this.ws) {
      this.ws.close(code, reason);
      this.ws = null;
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
      console.log(`[BrowserWebSocketAdapter] ${message}`, ...args);
    }
  }
}

/**
 * 创建浏览器 WebSocket 适配器的工厂函数
 */
export function createBrowserAdapter(options?: AdapterOptions): IWebSocketAdapter {
  return new BrowserWebSocketAdapter(options);
}