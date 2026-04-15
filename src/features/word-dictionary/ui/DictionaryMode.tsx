"use client";

import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { isInDictionaryQueue, useAppStore } from "@/shared/model/app-store";
import {
  StepFixation,
  StepImageCheck,
  StepSceneCreation,
  StepSoundEncoding,
} from "@/features/word-encoding/ui/encoding-steps";

type DictionaryModeProps = {
  listId: string;
};

type Step = 1 | 2 | 3 | 4;

function CompletionState({ listId, empty }: { listId: string; empty?: boolean }) {
  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h2">
          {empty ? "Dictionary queue is empty" : "Dictionary queue complete"}
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {empty
            ? "No words have reached the dictionary queue yet."
            : "All difficult words have been processed."}
        </Typography>
      </Stack>
      <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
        <Button variant="outlined">Back to list</Button>
      </Link>
    </Stack>
  );
}

export function DictionaryMode({ listId }: DictionaryModeProps) {
  const allWords = useAppStore((state) => state.words);
  const setMeaningVisualization = useAppStore((state) => state.setMeaningVisualization);
  const saveEncoding = useAppStore((state) => state.saveEncoding);
  const skipWord = useAppStore((state) => state.skipWord);

  // Capture session queue once on mount — dictionary words (skipped, round === 3)
  const allWordsRef = useRef(allWords);
  const [queue, setQueue] = useState<string[]>(() =>
    allWordsRef.current
      .filter((w) => w.listId === listId && isInDictionaryQueue(w))
      .map((w) => w.id),
  );

  const [step, setStep] = useState<Step>(1);
  const [soundAssociation, setSoundAssociation] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [doneCount, setDoneCount] = useState(0);

  const wordsMap = useMemo(() => new Map(allWords.map((w) => [w.id, w])), [allWords]);

  const total = queue.length;
  const currentId = queue[0] ?? null;
  const current = currentId ? (wordsMap.get(currentId) ?? null) : null;

  function resetInputs() {
    setSoundAssociation("");
    setSceneDescription("");
    setStep(1);
  }

  function moveToNext() {
    setQueue((q) => q.slice(1));
    setDoneCount((n) => n + 1);
    resetInputs();
  }

  // Step 1 — no setMeaningVisualization(false) on skip (word stays in dictionary)
  function handleHasImage() {
    if (!currentId) return;
    setMeaningVisualization(currentId, true);
    setStep(2);
  }

  function handleImageSkip() {
    if (!currentId) return;
    // skipWord keeps round at 3 (cap), word stays in dictionary queue
    skipWord(currentId);
    moveToNext();
  }

  function handleSoundNext() {
    if (!soundAssociation.trim()) return;
    setStep(3);
  }

  function handleSoundSkip() {
    if (!currentId) return;
    skipWord(currentId);
    moveToNext();
  }

  function handleSceneSave() {
    if (!sceneDescription.trim()) return;
    setStep(4);
  }

  function handleSceneSkip() {
    if (!currentId) return;
    skipWord(currentId);
    moveToNext();
  }

  function handleDone() {
    if (!currentId) return;
    saveEncoding(currentId, {
      soundAssociation: soundAssociation.trim(),
      sceneDescription: sceneDescription.trim(),
    });
    moveToNext();
  }

  if (total === 0) return <CompletionState listId={listId} empty />;
  if (!current) return <CompletionState listId={listId} />;

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
          <Button variant="text" size="small" sx={{ px: 0, minHeight: "auto" }}>← Back</Button>
        </Link>
        <Stack alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            {doneCount + 1} / {total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Step {step} / 4
          </Typography>
        </Stack>
      </Stack>

      {/* Helper hint — no timer in this mode */}
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Используй словарь для поиска подходящей ассоциации
      </Typography>

      {/* Step content */}
      {step === 1 && (
        <StepImageCheck
          word={current}
          hint="Попробуй ещё раз — без таймера"
          onHasImage={handleHasImage}
          onSkip={handleImageSkip}
        />
      )}
      {step === 2 && (
        <StepSoundEncoding
          word={current}
          value={soundAssociation}
          onChange={setSoundAssociation}
          onNext={handleSoundNext}
          onSkip={handleSoundSkip}
        />
      )}
      {step === 3 && (
        <StepSceneCreation
          value={sceneDescription}
          onChange={setSceneDescription}
          onSave={handleSceneSave}
          onSkip={handleSceneSkip}
        />
      )}
      {step === 4 && (
        <StepFixation
          word={current}
          soundAssociation={soundAssociation}
          sceneDescription={sceneDescription}
          onDone={handleDone}
        />
      )}
    </Stack>
  );
}
