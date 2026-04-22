"use client";

import { createContext, type ReactNode, useRef } from "react";
import {
  type PatternsStoreApi,
  createPatternsStore,
} from "./patterns-store";

export const PatternsStoreContext = createContext<
  PatternsStoreApi | undefined
>(undefined);

type PatternsStoreProviderProps = {
  children: ReactNode;
};

export function PatternsStoreProvider({
  children,
}: PatternsStoreProviderProps) {
  const storeRef = useRef<PatternsStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createPatternsStore();
  }

  return (
    <PatternsStoreContext.Provider value={storeRef.current}>
      {children}
    </PatternsStoreContext.Provider>
  );
}
