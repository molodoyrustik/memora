"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type AppStore, type AppStoreApi, createAppStore } from "./app-store";

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore<T>(selector: (state: AppStore) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return useStore(store, selector);
}
