export type Pattern = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

// 'new'      — not yet processed (First Pass queue)
// 'marked'   — needs extra work (Review Marked queue)
// 'learning' — in active learned set (Full Practice queue)
export type SentenceStatus = "new" | "marked" | "learning";

export type PatternSentence = {
  id: string;
  patternId: string;
  sourceText: string;
  targetText: string;
  comment: string | null;
  status: SentenceStatus;
  lastPracticedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Recorded at the end of each Full Practice run.
export type PatternRun = {
  id: string;
  patternId: string;
  durationSec: number;
  completedAt: string;
};
