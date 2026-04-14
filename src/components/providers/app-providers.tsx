"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            background: "#131313",
            color: "#FEFDFC",
            border: "1px solid rgba(212, 202, 202, 0.16)",
          },
        }}
      />
    </SessionProvider>
  );
}
