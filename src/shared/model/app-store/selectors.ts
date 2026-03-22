import { useCallback } from "react";
import { useAppStore } from "./AppStoreProvider";
import type { AppStore } from "./app-store";

export const listsSelector = (state: AppStore) => state.lists;
export const wordsSelector = (state: AppStore) => state.words;
export const selectedListIdSelector = (state: AppStore) => state.selectedListId;

export function useAppStoreSelectors() {
  const lists = useAppStore(listsSelector);
  const words = useAppStore(wordsSelector);

  const getWordsByListId = useCallback(
    (listId: string) => words.filter((w) => w.listId === listId),
    [words],
  );

  return {
    lists,
    words,
    getWordsByListId,
  };
}
