"use client";

import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/shared/model/app-store";

type SelectionModeProps = {
  listId: string;
};

export function SelectionMode({ listId }: SelectionModeProps) {
  const allWords = useAppStore((state) => state.words);
  const selectWord = useAppStore((state) => state.selectWord);
  const rejectWord = useAppStore((state) => state.rejectWord);

  // Capture the session queue once on mount (word IDs only)
  const allWordsRef = useRef(allWords);
  const [queue, setQueue] = useState<string[]>(() =>
    allWordsRef.current
      .filter((w) => w.listId === listId && w.status === "new")
      .map((w) => w.id),
  );

  const total = queue.length;

  // Build a map for fast word lookup by id
  const wordsMap = useMemo(
    () => new Map(allWords.map((w) => [w.id, w])),
    [allWords],
  );

  // Track how many words have been committed (selected or rejected)
  const [processed, setProcessed] = useState(0);

  const currentId = queue[0] ?? null;
  const current = currentId ? (wordsMap.get(currentId) ?? null) : null;
  const isFinished = queue.length === 0;

  function handleNeedToLearn() {
    if (!currentId) return;
    selectWord(currentId);
    setProcessed((n) => n + 1);
    setQueue((q) => q.slice(1));
  }

  function handleAlreadyKnow() {
    if (!currentId) return;
    rejectWord(currentId, "already_known");
    setProcessed((n) => n + 1);
    setQueue((q) => q.slice(1));
  }

  function handleSkip() {
    // Move current word to the end of the queue
    setQueue((q) => [...q.slice(1), q[0]]);
  }

  if (total === 0) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "60vh" }}
      >
        <Stack spacing={1} alignItems="center">
          <Typography variant="h2">Nothing to select</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            There are no new words in this list.
          </Typography>
        </Stack>
        <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back to list</Button>
        </Link>
      </Stack>
    );
  }

  if (isFinished) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "60vh" }}
      >
        <Stack spacing={1} alignItems="center">
          <Typography variant="h2">Selection complete</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            All new words in this list have been processed.
          </Typography>
        </Stack>
        <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back to list</Button>
        </Link>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
          <Button variant="text" size="small" sx={{ px: 0, minHeight: "auto" }}>
            ← Back
          </Button>
        </Link>
        <Typography variant="caption" color="text.secondary">
          {processed} / {total} done
        </Typography>
      </Stack>

      {/* Word card */}
      <Card>
        <CardContent>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 160, py: 2 }}
          >
            <Typography variant="h1" textAlign="center">
              {current?.sourceText ?? "—"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={handleNeedToLearn}>
          Need to learn
        </Button>
        <Button variant="outlined" fullWidth onClick={handleAlreadyKnow}>
          I know
        </Button>
        <Button variant="text" fullWidth onClick={handleSkip} color="inherit">
          Skip
        </Button>
      </Stack>
    </Stack>
  );
}
