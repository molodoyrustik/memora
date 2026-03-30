"use client";

import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/shared/model/app-store";
import { generateId } from "@/shared/lib/ids";
import { ImportDrawer, type ImportedWord } from "@/features/import-words";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PreviewWord = { id: string; ru: string; en: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePreviewWord(ru: string, en: string): PreviewWord {
  return { id: generateId(), ru, en };
}

function deduplicateWords(existing: PreviewWord[], incoming: ImportedWord[]): PreviewWord[] {
  const keys = new Set(existing.map((w) => `${w.ru}||${w.en}`));
  return incoming.filter((w) => !keys.has(`${w.ru}||${w.en}`));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddNewList() {
  const router = useRouter();
  const createList = useAppStore((state) => state.createList);
  const addWordsToList = useAppStore((state) => state.addWordsToList);

  const [name, setName] = useState("");
  // TODO: add description to domain model when backend is ready
  const [description, setDescription] = useState("");

  const [manualRu, setManualRu] = useState("");
  const [manualEn, setManualEn] = useState("");
  const ruInputRef = useRef<HTMLInputElement>(null);

  const [words, setWords] = useState<PreviewWord[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const canCreate = name.trim().length > 0 && words.length > 0;

  function handleAddWord() {
    const ru = manualRu.trim();
    const en = manualEn.trim();
    if (!ru || !en) return;
    const isDuplicate = words.some((w) => w.ru === ru && w.en === en);
    if (!isDuplicate) {
      setWords((prev) => [...prev, makePreviewWord(ru, en)]);
    }
    setManualRu("");
    setManualEn("");
    ruInputRef.current?.focus();
  }

  function handleRemoveWord(id: string) {
    setWords((prev) => prev.filter((w) => w.id !== id));
  }

  function handleImport(imported: ImportedWord[]) {
    const unique = deduplicateWords(words, imported);
    setWords((prev) => [...prev, ...unique]);
    setDrawerOpen(false);
  }

  function handleCreate() {
    if (!canCreate) return;
    const list = createList({ name: name.trim() });
    addWordsToList({ listId: list.id, words: words.map(({ ru, en }) => ({ ru, en })) });
    router.push(`/lists/${list.id}`);
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack spacing={0.5}>
          <Link href="/lists" style={{ textDecoration: "none" }}>
            <Button variant="text" size="small" sx={{ px: 0, minHeight: "auto" }}>
              ← Back to Lists
            </Button>
          </Link>
          <Typography variant="h1">Create list</Typography>
        </Stack>

        {/* List info */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h3">List info</Typography>
              <TextField
                label="List name"
                placeholder="e.g. Travel Vocabulary"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                label="Description (optional)"
                placeholder="What is this list about?"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={2}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Words */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3">Words</Typography>
                <Button variant="outlined" size="small" onClick={() => setDrawerOpen(true)}>
                  + Import
                </Button>
              </Stack>

              {/* Manual add row */}
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  inputRef={ruInputRef}
                  label="Russian"
                  placeholder="кошка"
                  size="small"
                  fullWidth
                  value={manualRu}
                  onChange={(e) => setManualRu(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
                />
                <TextField
                  label="English"
                  placeholder="cat"
                  size="small"
                  fullWidth
                  value={manualEn}
                  onChange={(e) => setManualEn(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
                />
                <Button
                  variant="contained"
                  onClick={handleAddWord}
                  disabled={!manualRu.trim() || !manualEn.trim()}
                  sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  Add
                </Button>
              </Stack>

              {/* Preview list */}
              {words.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No words yet. Add manually or import.
                </Typography>
              ) : (
                <>
                  <Divider />
                  <Stack spacing={0} divider={<Divider />}>
                    {words.map((word) => (
                      <Stack
                        key={word.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ py: 1 }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body1">{word.ru}</Typography>
                          <Typography variant="body2" color="text.secondary">{word.en}</Typography>
                        </Stack>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveWord(word.id)}
                          aria-label="Remove word"
                        >
                          ✕
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {words.length} {words.length === 1 ? "word" : "words"} added
                  </Typography>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Create button */}
        <Button
          variant="contained"
          fullWidth
          disabled={!canCreate}
          onClick={handleCreate}
        >
          Create list
        </Button>
      </Stack>

      <ImportDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onImport={handleImport}
      />
    </Container>
  );
}
