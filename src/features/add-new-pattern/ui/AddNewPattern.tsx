"use client";

import {
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImportSentencesDrawer,
  type ImportedSentence,
} from "@/features/import-sentences";
import { generateId } from "@/shared/lib/ids";
import { usePatternsStore } from "@/shared/model/patterns-store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PreviewSentence = {
  id: string;
  sourceText: string;
  targetText: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deduplicateSentences(
  existing: PreviewSentence[],
  incoming: ImportedSentence[],
): PreviewSentence[] {
  const keys = new Set(
    existing.map((s) => `${s.sourceText}||${s.targetText}`),
  );
  return incoming.filter(
    (s) => !keys.has(`${s.sourceText}||${s.targetText}`),
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddNewPattern() {
  const router = useRouter();
  const createPattern = usePatternsStore((s) => s.createPattern);
  const addSentencesBulk = usePatternsStore((s) => s.addSentencesBulk);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [manualSource, setManualSource] = useState("");
  const [manualTarget, setManualTarget] = useState("");
  const sourceInputRef = useRef<HTMLInputElement>(null);

  const [sentences, setSentences] = useState<PreviewSentence[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const canCreate = name.trim().length > 0 && sentences.length > 0;

  function handleAddSentence() {
    const sourceText = manualSource.trim();
    const targetText = manualTarget.trim();
    if (!sourceText || !targetText) return;
    const isDuplicate = sentences.some(
      (s) => s.sourceText === sourceText && s.targetText === targetText,
    );
    if (!isDuplicate) {
      setSentences((prev) => [
        ...prev,
        { id: generateId(), sourceText, targetText },
      ]);
    }
    setManualSource("");
    setManualTarget("");
    sourceInputRef.current?.focus();
  }

  function handleRemoveSentence(id: string) {
    setSentences((prev) => prev.filter((s) => s.id !== id));
  }

  function handleImport(imported: ImportedSentence[]) {
    const unique = deduplicateSentences(sentences, imported);
    setSentences((prev) => [...prev, ...unique]);
    setDrawerOpen(false);
  }

  function handleCreate() {
    if (!canCreate) return;
    const pattern = createPattern({
      name: name.trim(),
      description: description.trim() || null,
    });
    addSentencesBulk({
      patternId: pattern.id,
      sentences: sentences.map(({ sourceText, targetText }) => ({
        sourceText,
        targetText,
      })),
    });
    router.push(`/patterns/${pattern.id}`);
  }

  return (
    <div style={{ padding: "32px 0" }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack spacing={0.5}>
          <Link href="/patterns" style={{ textDecoration: "none" }}>
            <Button
              variant="text"
              size="small"
              sx={{ px: 0, minHeight: "auto" }}
            >
              ← Back to Patterns
            </Button>
          </Link>
          <Typography variant="h1">Create pattern</Typography>
        </Stack>

        {/* Pattern info */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h3">Pattern info</Typography>
              <TextField
                label="Pattern name"
                placeholder="e.g. Present Simple"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                label="Description (optional)"
                placeholder="What grammar structure does this pattern cover?"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={2}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Sentences */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h3">Sentences</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDrawerOpen(true)}
                >
                  + Import
                </Button>
              </Stack>

              {/* Manual add */}
              <Stack spacing={1}>
                <TextField
                  inputRef={sourceInputRef}
                  label="Russian sentence"
                  placeholder="Я иду в магазин"
                  size="small"
                  fullWidth
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSentence()}
                />
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="English sentence"
                    placeholder="I go to the store"
                    size="small"
                    fullWidth
                    value={manualTarget}
                    onChange={(e) => setManualTarget(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSentence()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSentence}
                    disabled={!manualSource.trim() || !manualTarget.trim()}
                    sx={{ flexShrink: 0 }}
                  >
                    Add
                  </Button>
                </Stack>
              </Stack>

              {/* Preview list */}
              {sentences.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No sentences yet. Add manually or import.
                </Typography>
              ) : (
                <>
                  <Divider />
                  <Stack spacing={0} divider={<Divider />}>
                    {sentences.map((s) => (
                      <Stack
                        key={s.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{ py: 1 }}
                        gap={1}
                      >
                        <Stack spacing={0.25} sx={{ flex: 1 }}>
                          <Typography variant="body1">
                            {s.sourceText}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {s.targetText}
                          </Typography>
                        </Stack>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveSentence(s.id)}
                          aria-label="Remove sentence"
                        >
                          ✕
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {sentences.length}{" "}
                    {sentences.length === 1 ? "sentence" : "sentences"} added
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
          Create pattern
        </Button>
      </Stack>

      <ImportSentencesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
