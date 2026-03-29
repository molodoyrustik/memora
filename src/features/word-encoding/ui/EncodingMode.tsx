"use client";

import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/shared/model/app-store";
import type { Word } from "@/entities/word/model/types";

type EncodingModeProps = {
  listId: string;
};

type Step = 1 | 2 | 3 | 4;

// ---------------------------------------------------------------------------
// Sub-views
// ---------------------------------------------------------------------------

function StepImageCheck({
  word,
  onHasImage,
  onSkip,
}: {
  word: Word;
  onHasImage: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 160, py: 2 }} spacing={2}>
            <Typography variant="h1" textAlign="center">{word.ru}</Typography>
            <Typography variant="body2" color="text.secondary">Представь это</Typography>
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={onHasImage}>Есть образ</Button>
        <Button variant="text" fullWidth color="inherit" onClick={onSkip}>Пропустить</Button>
      </Stack>
    </>
  );
}

function StepSoundEncoding({
  word,
  value,
  onChange,
  onNext,
  onSkip,
}: {
  word: Word;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h2" textAlign="center">{word.en}</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">{word.ru}</Typography>
            </Stack>
            <TextField
              label="Звуковая ассоциация"
              placeholder="Введите ассоциацию"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && onNext()}
              fullWidth
              autoFocus
            />
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={onNext} disabled={!value.trim()}>Next</Button>
        <Button variant="text" fullWidth color="inherit" onClick={onSkip}>Skip</Button>
      </Stack>
    </>
  );
}

function StepSceneCreation({
  value,
  onChange,
  onSave,
  onSkip,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Соедини два образа
            </Typography>
            <TextField
              label="Сцена"
              placeholder="Опиши сцену"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && onSave()}
              fullWidth
              multiline
              minRows={3}
              autoFocus
            />
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={onSave} disabled={!value.trim()}>Save</Button>
        <Button variant="text" fullWidth color="inherit" onClick={onSkip}>Skip</Button>
      </Stack>
    </>
  );
}

function StepFixation({
  word,
  soundAssociation,
  sceneDescription,
  onDone,
}: {
  word: Word;
  soundAssociation: string;
  sceneDescription: string;
  onDone: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h2">{word.en}</Typography>
              <Typography variant="body2" color="text.secondary">{word.ru}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">Ассоциация</Typography>
              <Typography variant="body1">{soundAssociation}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">Сцена</Typography>
              <Typography variant="body1">{sceneDescription}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Посмотри и проговори слово
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Button variant="contained" fullWidth onClick={onDone}>Done</Button>
    </>
  );
}

function CompletionState({ listId, empty }: { listId: string; empty?: boolean }) {
  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h2">{empty ? "Nothing to encode" : "Encoding complete"}</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {empty
            ? "There are no selected words in this list."
            : "All selected words have been processed."}
        </Typography>
      </Stack>
      <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
        <Button variant="outlined">Back to list</Button>
      </Link>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EncodingMode({ listId }: EncodingModeProps) {
  const allWords = useAppStore((state) => state.words);
  const setMeaningVisualization = useAppStore((state) => state.setMeaningVisualization);
  const saveEncoding = useAppStore((state) => state.saveEncoding);
  const skipWord = useAppStore((state) => state.skipWord);

  // Capture session queue once on mount (word IDs)
  const allWordsRef = useRef(allWords);
  const [queue, setQueue] = useState<string[]>(() =>
    allWordsRef.current
      .filter((w) => w.listId === listId && w.status === "selected")
      .map((w) => w.id),
  );

  const [step, setStep] = useState<Step>(1);
  const [soundAssociation, setSoundAssociation] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");

  const wordsMap = useMemo(() => new Map(allWords.map((w) => [w.id, w])), [allWords]);

  const total = queue.length;
  const [doneCount, setDoneCount] = useState(0);

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

  // Step 1
  function handleHasImage() {
    if (!currentId) return;
    setMeaningVisualization(currentId, true);
    setStep(2);
  }

  function handleNoImage() {
    if (!currentId) return;
    setMeaningVisualization(currentId, false);
    skipWord(currentId);
    moveToNext();
  }

  // Step 2
  function handleSoundNext() {
    if (!soundAssociation.trim()) return;
    setStep(3);
  }

  function handleSoundSkip() {
    if (!currentId) return;
    skipWord(currentId);
    moveToNext();
  }

  // Step 3
  function handleSceneSave() {
    if (!sceneDescription.trim()) return;
    setStep(4);
  }

  function handleSceneSkip() {
    if (!currentId) return;
    skipWord(currentId);
    moveToNext();
  }

  // Step 4
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
          <Button variant="text" size="small" sx={{ px: 0, minHeight: "auto" }}>
            ← Back
          </Button>
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

      {/* Step content */}
      {step === 1 && (
        <StepImageCheck word={current} onHasImage={handleHasImage} onSkip={handleNoImage} />
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
