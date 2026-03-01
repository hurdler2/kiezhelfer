"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket: TypedSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000",
      {
        auth: { userId: session.user.id },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.user?.id]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("join_conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("leave_conversation", conversationId);
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    socketRef.current?.emit("send_message", { conversationId, content });
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing_start", { conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing_stop", { conversationId });
  }, []);

  return {
    socket: socketRef,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
