export interface OnlineEntry {
  userId: string;
  ip: string;
  lastSeen: Date;
  pathname: string;
}

// Global singleton — survives hot-reloads because of the custom Node.js server
declare global {
  // eslint-disable-next-line no-var
  var _onlineUsers: Map<string, OnlineEntry> | undefined;
}

export const onlineStore: Map<string, OnlineEntry> =
  global._onlineUsers ?? (global._onlineUsers = new Map());

export function updatePresence(userId: string, ip: string, pathname: string) {
  onlineStore.set(userId, { userId, ip, lastSeen: new Date(), pathname });
}

/** Returns users seen within the last `thresholdMs` milliseconds. */
export function getOnlineUsers(thresholdMs = 2 * 60 * 1000): OnlineEntry[] {
  const cutoff = new Date(Date.now() - thresholdMs);
  return Array.from(onlineStore.values()).filter((u) => u.lastSeen > cutoff);
}
