"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import { useTranslations } from "next-intl";
import Avatar from "@/components/ui/Avatar";
import { Send, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { MessageWithSender } from "@/types";

interface Props {
  conversationId: string;
  initialMessages: MessageWithSender[];
  otherUser: { id: string; name: string | null; avatarUrl?: string | null };
}

export default function ChatWindow({ conversationId, initialMessages, otherUser }: Props) {
  const { data: session } = useSession();
  const t = useTranslations("messages");
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { socket, joinConversation, leaveConversation, startTyping, stopTyping } = useSocket();

  useEffect(() => {
    joinConversation(conversationId);

    const s = socket.current;
    if (!s) return;

    // Only add messages from OTHER users — own messages come from HTTP response
    s.on("new_message", (message) => {
      if (message.conversationId === conversationId && message.senderId !== session?.user?.id) {
        setMessages((prev) => [...prev, message as unknown as MessageWithSender]);
      }
    });

    s.on("user_typing", ({ userId }) => {
      if (userId === otherUser.id) setIsTyping(true);
    });

    s.on("user_stopped_typing", ({ userId }) => {
      if (userId === otherUser.id) setIsTyping(false);
    });

    return () => {
      leaveConversation(conversationId);
      s.off("new_message");
      s.off("user_typing");
      s.off("user_stopped_typing");
    };
  }, [conversationId, otherUser.id, joinConversation, leaveConversation, socket, session?.user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    startTyping(conversationId);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => stopTyping(conversationId), 1500);
  }

  async function handleSend() {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");
    stopTyping(conversationId);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const message = await res.json();
        setMessages((prev) => [...prev, message as MessageWithSender]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <Avatar src={otherUser.avatarUrl} name={otherUser.name} size="md" />
        <div>
          <p className="font-medium text-gray-900">{otherUser.name}</p>
          {isTyping && (
            <p className="text-xs text-brand-600 animate-pulse">{t("typing", { name: otherUser.name ?? "" })}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === session?.user?.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMine && (
                <Avatar
                  src={msg.sender.profile?.avatarUrl}
                  name={msg.sender.name}
                  size="sm"
                />
              )}
              <div className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-brand-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? "text-brand-200" : "text-gray-400"}`}>
                    {formatRelativeTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeMessage")}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
