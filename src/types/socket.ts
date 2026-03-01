import type { MessageWithSender } from "./index";

export interface ServerToClientEvents {
  new_message: (message: MessageWithSender) => void;
  user_typing: (data: { userId: string; userName: string }) => void;
  user_stopped_typing: (data: { userId: string }) => void;
  conversation_created: (conversation: { id: string }) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  join_conversation: (conversationId: string) => void;
  leave_conversation: (conversationId: string) => void;
  send_message: (payload: { conversationId: string; content: string }) => void;
  typing_start: (payload: { conversationId: string }) => void;
  typing_stop: (payload: { conversationId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  userName: string;
}
