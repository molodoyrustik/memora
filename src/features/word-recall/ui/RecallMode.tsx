"use client";

import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/shared/model/app-store";

type RecallModeProps = {
  listId: string;
};

const RECALL_STATUSES = ["encoded", "learning", "weak"] as const;

export function RecallMode({ listId }: RecallModeProps) {
  const allWords = useAppStore((state) => state.words);
  const markRecallResult = useAppStore((state) => state.markRecallResult);

  const allWordsRef = useRef(allWords);
  const [queue, setQueue] = useState<string[]>(() =>
    allWordsRef.current
      .filter((w) => w.listId === listId && (RECALL_STATUSES as readonly string[]).includes(w.status))
      .map((w) => w.id),
  );

  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  const wordsMap = useMemo(() => new Map(allWords.map((w) => [w.id, w])), [allWords]);

  const total = queue.length;
  const currentId = queue[0] ?? null;
  const current = currentId ? (wordsMap.get(currentId) ?? null) : null;

  function moveToNext() {
    setQueue((q) => q.slice(1));
    setDoneCount((n) => n + 1);
    setIsAnswerVisible(false);
  }

  function handleRemembered() {
    if (!currentId) return;
    markRecallResult(currentId, true);
    moveToNext();
  }

  function handleForgot() {
    if (!currentId) return;
    markRecallResult(currentId, false);
    moveToNext();
  }

  if (total === 0) {
    return (
      <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h2">Nothing to recall</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            There are no words ready for review in this list.
          </Typography>
        </Stack>
        <Link href={`/lists/${listId}`} style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back to list</Button>
        </Link>
      </Stack>
    );
  }

  if (!current) {
    return (
      <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h2">Recall complete</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            All review words have been processed.
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
          {doneCount + 1} / {total}
        </Typography>
      </Stack>

      {/* Main card */}
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            {/* RU word */}
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h1" textAlign="center">
                {current.ru}
              </Typography>
            </Stack>

            {/* Scene description */}
            {current.sceneDescription && (
              <>
                <Divider />
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Сцена
                  </Typography>
                  <Typography variant="body1">{current.sceneDescription}</Typography>
                </Stack>
              </>
            )}

            {/* Sound association */}
            {current.soundAssociation && (
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Ассоциация
                </Typography>
                <Typography variant="body1">{current.soundAssociation}</Typography>
              </Stack>
            )}

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Какое это слово?
            </Typography>

            {/* Answer reveal */}
            {isAnswerVisible && (
              <>
                <Divider />
                <Stack alignItems="center" sx={{ py: 1 }}>
                  <Typography variant="h2" color="primary">
                    {current.en}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      {!isAnswerVisible ? (
        <Button variant="contained" fullWidth onClick={() => setIsAnswerVisible(true)}>
          Show Answer
        </Button>
      ) : (
        <Stack spacing={1.5}>
          <Button variant="contained" fullWidth onClick={handleRemembered}>
            Remembered
          </Button>
          <Button variant="outlined" fullWidth onClick={handleForgot}>
            Didn't remember
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
