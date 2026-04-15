"use client";

import { createContext, type ReactNode, useRef } from "react";
import {
  type CharacteristicsStoreApi,
  createCharacteristicsStore,
} from "./characteristics-store";

export const CharacteristicsStoreContext = createContext<
  CharacteristicsStoreApi | undefined
>(undefined);

type CharacteristicsStoreProviderProps = {
  children: ReactNode;
};

export function CharacteristicsStoreProvider({
  children,
}: CharacteristicsStoreProviderProps) {
  const storeRef = useRef<CharacteristicsStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createCharacteristicsStore();
  }

  return (
    <CharacteristicsStoreContext.Provider value={storeRef.current}>
      {children}
    </CharacteristicsStoreContext.Provider>
  );
}
