"use client";

import { useMemo, useRef } from "react";
import {
  getFullPracticeQueue,
  usePatternsStore,
} from "@/shared/model/patterns-store";
import { SentencePracticeFlow } from "@/shared/ui/SentencePracticeFlow";

type FullPracticeModeProps = {
  patternId: string;
};

export function FullPracticeMode({ patternId }: FullPracticeModeProps) {
  const allSentences = usePatternsStore((s) => s.patternSentences);
  const markSentenceCorrect = usePatternsStore((s) => s.markSentenceCorrect);
  const markSentenceMistake = usePatternsStore((s) => s.markSentenceMistake);
  const addFullRun = usePatternsStore((s) => s.addFullRun);

  // Capture start time once on mount for measuring total run duration
  const startTimeRef = useRef(Date.now());

  const sentences = useMemo(
    () => getFullPracticeQueue(allSentences, patternId),
    [allSentences, patternId],
  );

  function handleSessionComplete() {
    const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    addFullRun(patternId, durationSec);
  }

  return (
    <SentencePracticeFlow
      sentences={sentences}
      backHref={`/patterns/${patternId}`}
      onCorrect={(id) => markSentenceCorrect(id, "full-practice")}
      onMistake={(id) => markSentenceMistake(id, "full-practice")}
      onSessionComplete={handleSessionComplete}
      emptyLabel="No learning sentences yet. Complete First Pass first."
      completeLabel="Full run recorded. Check your progress below."
    />
  );
}
