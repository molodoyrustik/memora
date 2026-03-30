"use client";

import {
  Button,
  Card,
  CardContent,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { generateId } from "@/shared/lib/ids";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ImportedWord = { id: string; ru: string; en: string };

type PairSep = "dash" | "comma" | "custom";
type ItemSep = "newline" | "semicolon" | "custom";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveItemSep(itemSep: ItemSep, custom: string): string {
  if (itemSep === "newline") return "\n";
  if (itemSep === "semicolon") return ";";
  return custom;
}

function resolvePairSep(pairSep: PairSep, custom: string): string {
  if (pairSep === "dash") return "-";
  if (pairSep === "comma") return ",";
  return custom;
}

function parseWords(raw: string, pairSep: string, itemSep: string): ImportedWord[] {
  if (!raw.trim() || !pairSep || !itemSep) return [];
  return raw
    .split(itemSep)
    .map((item) => {
      const idx = item.indexOf(pairSep);
      if (idx === -1) return null;
      const ru = item.slice(0, idx).trim();
      const en = item.slice(idx + pairSep.length).trim();
      if (!ru || !en) return null;
      return { id: generateId(), ru, en };
    })
    .filter((w): w is ImportedWord => w !== null);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ImportDrawerProps = {
  open: boolean;
  onClose: () => void;
  onImport: (words: ImportedWord[]) => void;
};

export function ImportDrawer({ open, onClose, onImport }: ImportDrawerProps) {
  const [raw, setRaw] = useState("");
  const [pairSep, setPairSep] = useState<PairSep>("dash");
  const [customPairSep, setCustomPairSep] = useState("");
  const [itemSep, setItemSep] = useState<ItemSep>("newline");
  const [customItemSep, setCustomItemSep] = useState("");

  const resolvedPairSep = resolvePairSep(pairSep, customPairSep);
  const resolvedItemSep = resolveItemSep(itemSep, customItemSep);
  const parsed = parseWords(raw, resolvedPairSep, resolvedItemSep);

  function handleImport() {
    if (parsed.length === 0) return;
    onImport(parsed);
    setRaw("");
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 420 }, p: 3 } }}
    >
      <Stack spacing={3} sx={{ height: "100%", overflowY: "auto" }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h2">Import words</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close">✕</IconButton>
        </Stack>

        {/* Textarea */}
        <TextField
          label="Paste words here"
          multiline
          minRows={6}
          maxRows={12}
          fullWidth
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={"собака - dog\nкошка - cat"}
          slotProps={{
            input: { sx: { overflowY: "auto" } },
          }}
        />

        {/* Pair separator */}
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Pair separator (RU — EN)
          </Typography>
          <Select
            value={pairSep}
            onChange={(e) => setPairSep(e.target.value as PairSep)}
            size="small"
            fullWidth
          >
            <MenuItem value="dash">Dash ( - )</MenuItem>
            <MenuItem value="comma">Comma ( , )</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
          {pairSep === "custom" && (
            <TextField
              size="small"
              placeholder="Enter separator"
              value={customPairSep}
              onChange={(e) => setCustomPairSep(e.target.value)}
              fullWidth
            />
          )}
        </Stack>

        {/* Item separator */}
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Item separator (between pairs)
          </Typography>
          <Select
            value={itemSep}
            onChange={(e) => setItemSep(e.target.value as ItemSep)}
            size="small"
            fullWidth
          >
            <MenuItem value="newline">New line</MenuItem>
            <MenuItem value="semicolon">Semicolon ( ; )</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
          {itemSep === "custom" && (
            <TextField
              size="small"
              placeholder="Enter separator"
              value={customItemSep}
              onChange={(e) => setCustomItemSep(e.target.value)}
              fullWidth
            />
          )}
        </Stack>

        {/* Format hint */}
        <Card variant="outlined">
          <CardContent sx={{ py: 1.5 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Format: Russian {resolvedPairSep || "—"} English
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {`Example:\nсобака${resolvedPairSep || "-"}dog\nкошка${resolvedPairSep || "-"}cat`}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Parsed preview */}
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Preview ({parsed.length} words)
          </Typography>
          {parsed.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No valid words found
            </Typography>
          ) : (
            <Stack
              spacing={0}
              divider={<Divider />}
              sx={{ maxHeight: 200, overflowY: "auto" }}
            >
              {parsed.map((w) => (
                <Stack key={w.id} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
                  <Typography variant="body2">{w.ru}</Typography>
                  <Typography variant="body2" color="text.secondary">{w.en}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>

        {/* Spacer */}
        <Stack sx={{ flex: 1 }} />

        {/* Footer */}
        <Button
          variant="contained"
          fullWidth
          disabled={parsed.length === 0}
          onClick={handleImport}
        >
          Import {parsed.length > 0 ? `${parsed.length} words` : "words"}
        </Button>
      </Stack>
    </Drawer>
  );
}
