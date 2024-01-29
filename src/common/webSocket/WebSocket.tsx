import { getAuthToken } from "../../utils/cookies-utils";
import { Stomp } from "@stomp/stompjs";

interface WebSocketOptions {
  url: any;
  onConnect?: (data: any) => void;
  onDisconnect?: any;
  onError?: (data: any) => void;
  onMessage?: (messageData: any) => void;
  topic: any;
  token?: string;
}

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private isDisconnected: boolean = false;
  private id: number;
  private reconnection: number = 0;
  private static latestId: number;
  private static callingWebSocketList: { [id: number]: any } = {};
  private client: any;
  private onConnect?: (data: any) => void;
  private onDisconnect?: () => void;
  private onError?: (data: any) => void;
  private onMessage?: (messageData: any) => void;
  private topic!: string;
  private token?: string;

  constructor() {
    this.id = WebSocketConnection.incrementId();
  }

  getCallingWebSocketList() {
    return WebSocketConnection.callingWebSocketList;
  }

  sendMessage(topic: string, msg: any): void {
    if (this.client) {
      this.client.send(topic, {}, msg);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
    }
  }

  connect({
    url,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
    topic,
    token,
  }: WebSocketOptions): void {
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onError = onError;
    this.onMessage = onMessage;
    this.topic = topic;
    this.token = token || getAuthToken();

    this.client = Stomp.over(new WebSocket(url));
    this.addToWebSocket(this.client);

    const successCallback = (data: any): void => {
      if (this.onConnect) this.onConnect(data);
      this.addToWebSocket(this.client);

      try {
        this.client.subscribe(this.topic, (messageData: any) =>
          this.gotANewMessage(messageData),
        );
      } catch {
        this.disconnect();
      }
    };

    const errorCallback = (data: any): void => {
      if (this.onDisconnect) this.onDisconnect();
      this.addToWebSocket(this.client);
    };

    if (this.client) {
      this.client.ws.onclose = (): void => {
        if (this.onDisconnect) this.onDisconnect();
      };

      this.client.connect(
        { token: this.token },
        successCallback,
        errorCallback,
      );
    }
  }

  private gotANewMessage(messageData: any): void {
    if (this.onMessage) this.onMessage(messageData);
    this.addToWebSocket(this.client);
  }

  private addToWebSocket(client: any): void {
    if (this.id && client) {
      WebSocketConnection.callingWebSocketList[this.id] = client;
    }
  }

  private static incrementId(): number {
    if (!WebSocketConnection.latestId) WebSocketConnection.latestId = 1;
    else WebSocketConnection.latestId++;
    return WebSocketConnection.latestId;
  }

  reConnect(): void {
    this.reconnection++;
    if (this.client) {
      this.connect({
        url: this.client.url,
        onConnect: this.onConnect,
        onDisconnect: this.onDisconnect,
        onError: this.onError,
        onMessage: this.onMessage,
        topic: this.topic,
        token: this.token,
      });
    }
  }
}

export const closeAllSockets = (): void => {
  for (const [key, value] of Object.entries(
    new WebSocketConnection().getCallingWebSocketList(),
  )) {
    try {
      value.disconnect();
    } catch {
      continue;
    }
  }
};

export const isAliveWebSocket = (): boolean => {
  for (const [key, value] of Object.entries(
    new WebSocketConnection().getCallingWebSocketList(),
  )) {
    if (
      value?.connected ||
      value?.ws?.readyState === 0 ||
      value?.ws?.readyState === 1
    ) {
      return true;
    }
  }
  return false;
};
