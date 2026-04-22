"use client";

import { useMemo } from "react";
import {
  getMarkedQueue,
  usePatternsStore,
} from "@/shared/model/patterns-store";
import { SentencePracticeFlow } from "@/shared/ui/SentencePracticeFlow";

type ReviewModeProps = {
  patternId: string;
};

export function ReviewMode({ patternId }: ReviewModeProps) {
  const allSentences = usePatternsStore((s) => s.patternSentences);
  const markSentenceCorrect = usePatternsStore((s) => s.markSentenceCorrect);
  const markSentenceMistake = usePatternsStore((s) => s.markSentenceMistake);

  const sentences = useMemo(
    () => getMarkedQueue(allSentences, patternId),
    [allSentences, patternId],
  );

  return (
    <SentencePracticeFlow
      sentences={sentences}
      backHref={`/patterns/${patternId}`}
      onCorrect={(id) => markSentenceCorrect(id, "review")}
      onMistake={(id) => markSentenceMistake(id, "review")}
      emptyLabel="No marked sentences to review."
      completeLabel="Review complete. Run again if any sentences were re-marked."
    />
  );
}
