"use client";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { WordStatus } from "@/entities/word/model/types";
import {
  isInDictionaryQueue,
  isInEncodingQueue,
  isInSkippedQueue,
  useAppStore,
} from "@/shared/model/app-store";

type ListDetailsProps = {
  listId: string;
};

const STATUS_LABELS: Record<WordStatus, string> = {
  new: "New",
  selected: "Selected",
  rejected: "Rejected",
  skipped: "Skipped",
  encoded: "Encoded",
  learning: "Learning",
  weak: "Weak",
  mastered: "Mastered",
};

const STATUS_COLORS: Record<
  WordStatus,
  "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  new: "default",
  selected: "primary",
  rejected: "error",
  skipped: "warning",
  encoded: "info",
  learning: "secondary",
  weak: "warning",
  mastered: "success",
};

export function ListDetails({ listId }: ListDetailsProps) {
  const [ru, setRu] = useState("");
  const [en, setEn] = useState("");

  const lists = useAppStore((state) => state.lists);
  const allWords = useAppStore((state) => state.words);
  const addWordToList = useAppStore((state) => state.addWordToList);

  const list = useMemo(
    () => lists.find((l) => l.id === listId),
    [lists, listId],
  );
  const words = useMemo(
    () => allWords.filter((w) => w.listId === listId),
    [allWords, listId],
  );

  const selectionQueue = useMemo(
    () => words.filter((w) => w.status === "new"),
    [words],
  );
  const encodingQueue = useMemo(() => words.filter(isInEncodingQueue), [words]);
  const skippedQueue = useMemo(() => words.filter(isInSkippedQueue), [words]);
  const dictionaryQueue = useMemo(
    () => words.filter(isInDictionaryQueue),
    [words],
  );
  const recallQueue = useMemo(
    () =>
      words.filter(
        (w) =>
          w.status === "encoded" ||
          w.status === "learning" ||
          w.status === "weak",
      ),
    [words],
  );

  function handleAddWord() {
    const trimRu = ru.trim();
    const trimEn = en.trim();
    if (!trimRu || !trimEn) return;
    addWordToList({ listId, ru: trimRu, en: trimEn });
    setRu("");
    setEn("");
  }

  if (!list) {
    return (
      <Stack spacing={2}>
        <Typography variant="body1" color="text.secondary">
          List not found.
        </Typography>
        <Link href="/lists" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back to Lists</Button>
        </Link>
      </Stack>
    );
  }

  const statusGroups: { label: string; count: number }[] = [
    { label: "New", count: words.filter((w) => w.status === "new").length },
    {
      label: "Selected",
      count: words.filter((w) => w.status === "selected").length,
    },
    {
      label: "Encoded",
      count: words.filter((w) => w.status === "encoded").length,
    },
    {
      label: "Skipped",
      count: words.filter((w) => w.status === "skipped").length,
    },
    {
      label: "Learning",
      count: words.filter((w) => w.status === "learning").length,
    },
    { label: "Weak", count: words.filter((w) => w.status === "weak").length },
    {
      label: "Mastered",
      count: words.filter((w) => w.status === "mastered").length,
    },
    { label: "Dictionary", count: dictionaryQueue.length },
  ];

  const modes = [
    {
      label: "Selection Mode",
      href: "selection",
      count: selectionQueue.length,
      active: selectionQueue.length > 0,
    },
    {
      label: "Encoding Mode",
      href: "encoding",
      count: encodingQueue.length,
      active: encodingQueue.length > 0,
    },
    {
      label: "Skipped Mode",
      href: "skipped",
      count: skippedQueue.length,
      active: skippedQueue.length > 0,
    },
    {
      label: "Dictionary Queue",
      href: "dictionary",
      count: dictionaryQueue.length,
      active: dictionaryQueue.length > 0,
    },
    {
      label: "Recall Mode",
      href: "recall",
      count: recallQueue.length,
      active: recallQueue.length > 0,
    },
  ] as const;

  return (
    <>
      {/* Header */}
      <Stack spacing={0.5}>
        <Link href="/lists" style={{ textDecoration: "none" }}>
          <Button variant="text" size="small" sx={{ px: 0, minHeight: "auto" }}>
            ← Back to Lists
          </Button>
        </Link>
        <Typography variant="h1">{list.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {words.length} {words.length === 1 ? "word" : "words"} total
        </Typography>
      </Stack>

      {/* Summary */}
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h3">Summary</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {statusGroups.map(({ label, count }) => (
                <Chip
                  key={label}
                  label={`${label}: ${count}`}
                  size="small"
                  variant={count > 0 ? "filled" : "outlined"}
                  color={count > 0 ? "primary" : "default"}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3">Modes</Typography>
            <Stack spacing={1.5}>
              {modes.map(({ label, href, count, active }) => (
                <Link
                  key={href}
                  href={`/lists/${listId}/${href}`}
                  style={{ textDecoration: "none" }}
                  aria-disabled={!active}
                  onClick={(e) => !active && e.preventDefault()}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={!active}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <span>{label}</span>
                    <Chip
                      label={count}
                      size="small"
                      color={active ? "primary" : "default"}
                      sx={{ pointerEvents: "none" }}
                    />
                  </Button>
                </Link>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Add Word */}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3">Add Word</Typography>
            <Stack direction="row" spacing={1.5}>
              <TextField
                label="Russian"
                placeholder="кошка"
                value={ru}
                onChange={(e) => setRu(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
                size="small"
                fullWidth
              />
              <TextField
                label="English"
                placeholder="cat"
                value={en}
                onChange={(e) => setEn(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
                size="small"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAddWord}
                disabled={!ru.trim() || !en.trim()}
                sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Add
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Words list */}
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h3">Words</Typography>
            {words.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No words yet. Add the first one above.
              </Typography>
            ) : (
              <Stack spacing={0} divider={<Divider />}>
                {words.map((word) => (
                  <Stack
                    key={word.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ py: 1.25 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body1">{word.ru}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {word.en}
                      </Typography>
                    </Stack>
                    <Chip
                      label={STATUS_LABELS[word.status]}
                      size="small"
                      color={STATUS_COLORS[word.status]}
                      variant="outlined"
                    />
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
