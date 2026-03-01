"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HeartbeatProvider() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const send = () => {
      fetch("/api/activity/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      }).catch(() => {});
    };

    send();
    const interval = setInterval(send, 30_000);
    return () => clearInterval(interval);
  }, [pathname, session?.user]);

  return null;
}
