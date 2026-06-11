"use client";

import { createContext, type ReactNode, useRef } from "react";
import { type CoursesStoreApi, createCoursesStore } from "./courses-store";

export const CoursesStoreContext = createContext<CoursesStoreApi | undefined>(undefined);

type CoursesStoreProviderProps = {
  children: ReactNode;
};

export function CoursesStoreProvider({ children }: CoursesStoreProviderProps) {
  const storeRef = useRef<CoursesStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createCoursesStore();
  }

  return (
    <CoursesStoreContext.Provider value={storeRef.current}>
      {children}
    </CoursesStoreContext.Provider>
  );
}
