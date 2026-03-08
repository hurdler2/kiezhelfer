"use client";

import { useEffect } from "react";

export default function ScrollRestorer() {
  useEffect(() => {
    const y = sessionStorage.getItem("restoreScrollY");
    if (y) {
      sessionStorage.removeItem("restoreScrollY");
      window.scrollTo({ top: parseInt(y), behavior: "instant" });
    }
  }, []);

  return null;
}
