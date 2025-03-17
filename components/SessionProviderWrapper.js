"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SessionProviderWrapper({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render any authentication-dependent UI until mounted
  // This prevents hydration errors by ensuring consistent rendering between server and client
  if (!mounted) {
    // Return a placeholder with the same structure as children but without authentication-dependent parts
    return <div className="auth-loading">{children}</div>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
