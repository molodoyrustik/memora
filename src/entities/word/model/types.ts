import type { ListId } from '@/entities/list/model/types';

export type WordId = string;

export type WordType = 'image_noun';

export type WordStatus =
  | 'new'
  | 'selected'
  | 'rejected'
  | 'skipped'
  | 'encoded'
  | 'learning'
  | 'weak'
  | 'mastered';

export type SelectionDecision =
  | 'unknown_and_needed'
  | 'already_known'
  | 'not_needed'
  | null;

export type Word = {
  id: WordId;
  listId: ListId;
  ru: string;
  en: string;
  type: WordType;
  status: WordStatus;
  selectionDecision: SelectionDecision;
  canVisualizeMeaning: boolean | null;
  soundAssociation: string | null;
  sceneDescription: string | null;
  skipCount: number;
  encodingAttemptCount: number;
  recallSuccessCount: number;
  recallFailCount: number;
  lastRecalledAt: string | null;
  nextReviewAt: string | null;
  createdAt: string;
  updatedAt: string;
};
