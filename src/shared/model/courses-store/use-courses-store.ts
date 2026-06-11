"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import type { CoursesStore } from "./courses-store";
import { CoursesStoreContext } from "./courses-store-provider";

export function useCoursesStore<T>(selector: (state: CoursesStore) => T): T {
  const store = useContext(CoursesStoreContext);
  if (!store) {
    throw new Error("useCoursesStore must be used within CoursesStoreProvider");
  }
  return useStore(store, selector);
}
