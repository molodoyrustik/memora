import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { List } from "@/entities/list";
import type { SelectionDecision, Word } from "@/entities/word";
import { nowISO } from "@/shared/lib/date";

import { makeList, makeWord, patchWord } from "./utils";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

type AppStoreState = {
  lists: List[];
  words: Word[];
  selectedListId: string | null;
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type AppStoreActions = {
  setSelectedListId: (listId: string | null) => void;

  createList: (params: { name: string }) => List;
  updateList: (
    listId: string,
    patch: Partial<Omit<List, "id" | "createdAt">>,
  ) => void;

  addWordToList: (params: { listId: string; ru: string; en: string }) => Word;
  addWordsToList: (params: {
    listId: string;
    words: { ru: string; en: string }[];
  }) => void;
  updateWord: (
    wordId: string,
    patch: Partial<Omit<Word, "id" | "listId" | "createdAt">>,
  ) => void;

  selectWord: (wordId: string) => void;
  rejectWord: (
    wordId: string,
    reason: Exclude<SelectionDecision, "unknown_and_needed" | null>,
  ) => void;

  setMeaningVisualization: (
    wordId: string,
    canVisualizeMeaning: boolean,
  ) => void;

  saveEncoding: (
    wordId: string,
    params: { soundAssociation: string; sceneDescription: string },
  ) => void;
  skipWord: (wordId: string) => void;

  markRecallResult: (wordId: string, remembered: boolean) => void;

  resetStore: () => void;
};

export type AppStore = AppStoreState & AppStoreActions;

export function createAppStore() {
  return createStore<AppStore>()(
    persist(
      (set) => ({
        lists: [],
        words: [],
        selectedListId: null,

        // --- Navigation ---

        setSelectedListId: (listId) => set({ selectedListId: listId }),

        // --- Lists ---

        createList: ({ name }) => {
          const list: List = makeList({ name });
          set((s) => ({ lists: [...s.lists, list] }));
          return list;
        },

        updateList: (listId, patch) => {
          set((s) => ({
            lists: s.lists.map((l) =>
              l.id === listId ? { ...l, ...patch, updatedAt: nowISO() } : l,
            ),
          }));
        },

        // --- Words ---

        addWordToList: ({ listId, ru, en }) => {
          const word = makeWord({ listId, ru, en });
          set((s) => ({ words: [...s.words, word] }));
          return word;
        },

        addWordsToList: ({ listId, words }) => {
          const newWords = words.map(({ ru, en }) =>
            makeWord({ listId, ru, en }),
          );
          set((s) => ({ words: [...s.words, ...newWords] }));
        },

        updateWord: (wordId, patch) => {
          set((s) => ({ words: patchWord(s.words, wordId, patch) }));
        },

        // --- Selection ---

        selectWord: (wordId) => {
          set((s) => ({
            words: patchWord(s.words, wordId, {
              status: "selected",
              selectionDecision: "unknown_and_needed",
            }),
          }));
        },

        rejectWord: (wordId, reason) => {
          set((s) => ({
            words: patchWord(s.words, wordId, {
              status: "rejected",
              selectionDecision: reason,
            }),
          }));
        },

        // --- Meaning visualization ---

        setMeaningVisualization: (wordId, canVisualizeMeaning) => {
          set((s) => ({
            words: patchWord(s.words, wordId, { canVisualizeMeaning }),
          }));
        },

        // --- Encoding ---

        saveEncoding: (wordId, { soundAssociation, sceneDescription }) => {
          set((s) => {
            const word = s.words.find((w) => w.id === wordId);
            if (!word) return s;
            return {
              words: patchWord(s.words, wordId, {
                soundAssociation,
                sceneDescription,
                status: "encoded",
                encodingAttemptCount: word.encodingAttemptCount + 1,
              }),
            };
          });
        },

        skipWord: (wordId) => {
          set((s) => {
            const word = s.words.find((w) => w.id === wordId);
            if (!word) return s;
            return {
              words: patchWord(s.words, wordId, {
                status: "skipped",
                skipCount: word.skipCount + 1,
                encodingAttemptCount: word.encodingAttemptCount + 1,
              }),
            };
          });
        },

        // --- Recall ---

        markRecallResult: (wordId, remembered) => {
          set((s) => {
            const word = s.words.find((w) => w.id === wordId);
            if (!word) return s;

            if (remembered) {
              const recallSuccessCount = word.recallSuccessCount + 1;
              const status = recallSuccessCount >= 3 ? "mastered" : "learning";
              return {
                words: patchWord(s.words, wordId, {
                  recallSuccessCount,
                  status,
                  lastRecalledAt: nowISO(),
                }),
              };
            } else {
              const recallFailCount = word.recallFailCount + 1;
              const status = recallFailCount >= 2 ? "weak" : "learning";
              return {
                words: patchWord(s.words, wordId, {
                  recallFailCount,
                  status,
                  lastRecalledAt: nowISO(),
                }),
              };
            }
          });
        },

        resetStore: () => set({ lists: [], words: [], selectedListId: null }),
      }),
      {
        name: "memora-store",
      },
    ),
  );
}

export type AppStoreApi = ReturnType<typeof createAppStore>;
