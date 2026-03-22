import type { List } from "@/entities/list";
import type { Word } from "@/entities/word";
import { nowISO } from "@/shared/lib/date";
import { generateId } from "@/shared/lib/ids";

export function patchWord(
  words: Word[],
  wordId: string,
  patch: Partial<Word>,
): Word[] {
  return words.map((w) =>
    w.id === wordId ? { ...w, ...patch, updatedAt: nowISO() } : w,
  );
}

export function makeWord(params: {
  listId: string;
  ru: string;
  en: string;
}): Word {
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

export function makeList(params: { name: string }): List {
  const now = nowISO();
  return {
    id: generateId(),
    name: params.name,
    sourceLanguage: "ru",
    targetLanguage: "en",
    createdAt: now,
    updatedAt: now,
  };
}
