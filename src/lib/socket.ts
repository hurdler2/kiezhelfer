import type { Server } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "@/types/socket";
import { prisma } from "./prisma";

type IO = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function initSocketHandlers(io: IO) {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId as string;
    if (!userId) {
      return next(new Error("Unauthorized"));
    }
    socket.data.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    const { userId } = socket.data;
    console.log(`[Socket] User ${userId} connected`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, content }) => {
      try {
        // Verify participant
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: { conversationId, userId },
          },
        });

        if (!participant) {
          socket.emit("error", "Keine Berechtigung");
          return;
        }

        // Save message
        const message = await prisma.message.create({
          data: { conversationId, senderId: userId, content },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatarUrl: true } },
              },
            },
          },
        });

        // Update conversation updatedAt
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // Increment unread count for other participants
        await prisma.conversationParticipant.updateMany({
          where: {
            conversationId,
            userId: { not: userId },
          },
          data: { unreadCount: { increment: 1 } },
        });

        // Broadcast to all in room
        io.to(`conversation:${conversationId}`).emit("new_message", message as any);
      } catch (err) {
        console.error("[Socket] send_message error:", err);
        socket.emit("error", "Nachricht konnte nicht gesendet werden");
      }
    });

    socket.on("typing_start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        userId,
        userName: socket.data.userName ?? "Jemand",
      });
    });

    socket.on("typing_stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("user_stopped_typing", { userId });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User ${userId} disconnected`);
    });
  });
}
