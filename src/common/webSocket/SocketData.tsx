import Toast from "../components/Toast/Toast";
import { isAliveWebSocket } from "./WebSocket";

export const actionOnMessage = (data: any) => {
  let message: any = null;

  try {
    message = JSON.parse(data?.body || {});
  } catch {
    message = "";
  }
  if (!message) return;

  if (message) {
    return Toast(
      "info",
      <div className="block px-2 py-1 cursor-pointer">
        <p className="pb-1  font-extrabold text-lg ">
          {message?.message || "You have a new notification!"}
        </p>
        <p className="pb-2 text-sm capitalize font-semibold">
          {message?.messageType
            ? "New Opportunity Notification"
            : "it seems something wrong from our end."}
        </p>
      </div>,
      20000,
    );
  }
};

export const socketData = ({
  token,
  socketInstance,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
}: {
  token?: string;
  socketInstance?: any;
  onConnect?: () => void;
  onDisconnect?: any;
  onError?: any;
  onMessage?: (messageData: any) => void;
  topic?: any;
}) => {
  return {
    url: process.env.SOCKET_URL,
    topic: process.env.SOCKET_TOPIC,
    token: token,
    onConnect: (data: any) => {},
    onDisconnect: (data: any, isDisconnected: any) => {
      try {
        if (socketInstance.reconection <= 2 && !isAliveWebSocket()) {
          socketInstance.reConnect();
        }
      } catch {}

      typeof onDisconnect == "function" && onDisconnect(data, isDisconnected);
    },
    onError: (data: any) => {
      typeof onError == "function" && onError(data);
    },
    onMessage: actionOnMessage,
  };
};
