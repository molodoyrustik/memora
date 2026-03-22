import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { List, ListId } from "@/entities/list/model/types";
import type {
  SelectionDecision,
  Word,
  WordId,
} from "@/entities/word/model/types";
import { nowISO } from "@/shared/lib/date";
import { generateId } from "@/shared/lib/ids";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

type StoreState = {
  lists: List[];
  words: Word[];
  selectedListId: ListId | null;
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type StoreActions = {
  setSelectedListId: (listId: ListId | null) => void;

  createList: (params: { name: string }) => List;
  updateList: (
    listId: ListId,
    patch: Partial<Omit<List, "id" | "createdAt">>,
  ) => void;

  addWordToList: (params: { listId: ListId; ru: string; en: string }) => Word;
  addWordsToList: (params: {
    listId: ListId;
    words: { ru: string; en: string }[];
  }) => void;
  updateWord: (
    wordId: WordId,
    patch: Partial<Omit<Word, "id" | "listId" | "createdAt">>,
  ) => void;

  selectWord: (wordId: WordId) => void;
  rejectWord: (
    wordId: WordId,
    reason: Exclude<SelectionDecision, "unknown_and_needed" | null>,
  ) => void;

  setMeaningVisualization: (
    wordId: WordId,
    canVisualizeMeaning: boolean,
  ) => void;

  saveEncoding: (
    wordId: WordId,
    params: { soundAssociation: string; sceneDescription: string },
  ) => void;
  skipWord: (wordId: WordId) => void;

  markRecallResult: (wordId: WordId, remembered: boolean) => void;

  resetStore: () => void;
};

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

type StoreSelectors = {
  getListWords: (listId: ListId) => Word[];
  getSelectionQueue: (listId: ListId) => Word[];
  getEncodingQueue: (listId: ListId) => Word[];
  getSkippedQueue: (listId: ListId) => Word[];
  getRecallQueue: (listId: ListId) => Word[];
};

// ---------------------------------------------------------------------------
// Dev seed
// ---------------------------------------------------------------------------

const SEED_LIST_ID = "seed-list-1";

const INITIAL_LISTS: List[] = [
  {
    id: SEED_LIST_ID,
    name: "Animals",
    sourceLanguage: "ru",
    targetLanguage: "en",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

const INITIAL_WORDS: Word[] = [
  {
    id: "w1",
    listId: SEED_LIST_ID,
    ru: "кошка",
    en: "cat",
    type: "image_noun",
    status: "new",
    selectionDecision: null,
    canVisualizeMeaning: null,
    soundAssociation: null,
    sceneDescription: null,
    skipCount: 0,
    encodingAttemptCount: 0,
    recallSuccessCount: 0,
    recallFailCount: 0,
    lastRecalledAt: null,
    nextReviewAt: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "w2",
    listId: SEED_LIST_ID,
    ru: "собака",
    en: "dog",
    type: "image_noun",
    status: "new",
    selectionDecision: null,
    canVisualizeMeaning: null,
    soundAssociation: null,
    sceneDescription: null,
    skipCount: 0,
    encodingAttemptCount: 0,
    recallSuccessCount: 0,
    recallFailCount: 0,
    lastRecalledAt: null,
    nextReviewAt: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "w3",
    listId: SEED_LIST_ID,
    ru: "птица",
    en: "bird",
    type: "image_noun",
    status: "new",
    selectionDecision: null,
    canVisualizeMeaning: null,
    soundAssociation: null,
    sceneDescription: null,
    skipCount: 0,
    encodingAttemptCount: 0,
    recallSuccessCount: 0,
    recallFailCount: 0,
    lastRecalledAt: null,
    nextReviewAt: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "w4",
    listId: SEED_LIST_ID,
    ru: "лошадь",
    en: "horse",
    type: "image_noun",
    status: "new",
    selectionDecision: null,
    canVisualizeMeaning: null,
    soundAssociation: null,
    sceneDescription: null,
    skipCount: 0,
    encodingAttemptCount: 0,
    recallSuccessCount: 0,
    recallFailCount: 0,
    lastRecalledAt: null,
    nextReviewAt: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "w5",
    listId: SEED_LIST_ID,
    ru: "рыба",
    en: "fish",
    type: "image_noun",
    status: "new",
    selectionDecision: null,
    canVisualizeMeaning: null,
    soundAssociation: null,
    sceneDescription: null,
    skipCount: 0,
    encodingAttemptCount: 0,
    recallSuccessCount: 0,
    recallFailCount: 0,
    lastRecalledAt: null,
    nextReviewAt: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

const INITIAL_STATE: StoreState = {
  lists: [],
  words: [],
  selectedListId: null,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function patchWord(
  words: Word[],
  wordId: WordId,
  patch: Partial<Word>,
): Word[] {
  return words.map((w) =>
    w.id === wordId ? { ...w, ...patch, updatedAt: nowISO() } : w,
  );
}

function makeWord(params: { listId: ListId; ru: string; en: string }): Word {
  const now = nowISO();
  return {
    id: generateId(),
    listId: params.listId,
    ru: params.ru,
    en: params.en,
    type: "image_noun",
    status: "new",
    selectionDecision: null,
    canVisualizeMeaning: null,
    soundAssociation: null,
    sceneDescription: null,
    skipCount: 0,
    encodingAttemptCount: 0,
    recallSuccessCount: 0,
    recallFailCount: 0,
    lastRecalledAt: null,
    nextReviewAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<StoreState & StoreActions & StoreSelectors>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // --- Navigation ---

      setSelectedListId: (listId) => set({ selectedListId: listId }),

      // --- Lists ---

      createList: ({ name }) => {
        const now = nowISO();
        const list: List = {
          id: generateId(),
          name,
          sourceLanguage: "ru",
          targetLanguage: "en",
          createdAt: now,
          updatedAt: now,
        };
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

      // --- Reset ---

      resetStore: () => set(INITIAL_STATE),

      // --- Selectors ---

      getListWords: (listId) => get().words.filter((w) => w.listId === listId),

      getSelectionQueue: (listId) =>
        get().words.filter((w) => w.listId === listId && w.status === "new"),

      getEncodingQueue: (listId) =>
        get().words.filter(
          (w) => w.listId === listId && w.status === "selected",
        ),

      getSkippedQueue: (listId) =>
        get().words.filter(
          (w) => w.listId === listId && w.status === "skipped",
        ),

      getRecallQueue: (listId) =>
        get().words.filter(
          (w) =>
            w.listId === listId &&
            (w.status === "encoded" ||
              w.status === "learning" ||
              w.status === "weak"),
        ),
    }),
    {
      name: "memora-store",
    },
  ),
);
