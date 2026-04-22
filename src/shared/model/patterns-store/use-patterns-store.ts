"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import type { PatternsStore } from "./patterns-store";
import { PatternsStoreContext } from "./patterns-store-provider";

export function usePatternsStore<T>(
  selector: (state: PatternsStore) => T,
): T {
  const store = useContext(PatternsStoreContext);
  if (!store) {
    throw new Error(
      "usePatternsStore must be used within PatternsStoreProvider",
    );
  }
  return useStore(store, selector);
}
