"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/model/store/store";

export function StoreHydration() {
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  return null;
}
