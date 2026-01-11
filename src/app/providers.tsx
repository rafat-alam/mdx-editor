"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/sonner";
import { store } from "../store/store";
import { ThemeProvider } from "@/components/themeprovider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </ThemeProvider>
    </Provider>
  );
}
