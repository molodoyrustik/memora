"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import type { CharacteristicsStore } from "./characteristics-store";
import { CharacteristicsStoreContext } from "./characteristics-store-provider";

export function useCharacteristicsStore<T>(
  selector: (state: CharacteristicsStore) => T,
): T {
  const store = useContext(CharacteristicsStoreContext);
  if (!store) {
    throw new Error(
      "useCharacteristicsStore must be used within CharacteristicsStoreProvider",
    );
  }
  return useStore(store, selector);
}
