"use client";

import { useMemo } from "react";
import {
  getFirstPassQueue,
  usePatternsStore,
} from "@/shared/model/patterns-store";
import { SentencePracticeFlow } from "@/shared/ui/SentencePracticeFlow";

type FirstPassModeProps = {
  patternId: string;
};

export function FirstPassMode({ patternId }: FirstPassModeProps) {
  const allSentences = usePatternsStore((s) => s.patternSentences);
  const markSentenceCorrect = usePatternsStore((s) => s.markSentenceCorrect);
  const markSentenceMistake = usePatternsStore((s) => s.markSentenceMistake);

  const sentences = useMemo(
    () => getFirstPassQueue(allSentences, patternId),
    [allSentences, patternId],
  );

  return (
    <SentencePracticeFlow
      sentences={sentences}
      backHref={`/patterns/${patternId}`}
      onCorrect={(id) => markSentenceCorrect(id, "first-pass")}
      onMistake={(id) => markSentenceMistake(id, "first-pass")}
      emptyLabel="No new sentences in this pattern."
      completeLabel="First pass complete. Check Review Marked for any hesitations."
    />
  );
}
