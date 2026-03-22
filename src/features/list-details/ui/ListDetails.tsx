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
import { useMemo } from "react";
import type { ListId } from "@/entities/list/model/types";
import { appStoreSelectors, useAppStore } from "@/shared/model/app-store";

const MODES = [
  { label: "Selection", href: "selection" },
  { label: "Encoding", href: "encoding" },
  { label: "Skipped", href: "skipped" },
  { label: "Recall", href: "recall" },
] as const;

type ListDetailsProps = {
  listId: ListId;
};

export function ListDetails({ listId }: ListDetailsProps) {
  const lists = useAppStore((state) => state.lists);
  const list = useMemo(() => {
    return lists.find((l) => l.id === listId);
  }, [lists, listId]);
  const listWords = useAppStore((state) => state.words);
  const words = useMemo(() => {
    return listWords.filter((w) => w.listId === listId);
  }, [listWords, listId]);

  if (!list) {
    return <Typography variant="body1">List not found.</Typography>;
  }

  return (
    <>
      <Typography variant="h1">{list.name}</Typography>

      <Card>
        <CardContent>
          {words.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No words yet.
            </Typography>
          ) : (
            <Stack spacing={1} divider={<Divider />}>
              {words.map((word) => (
                <Stack
                  key={word.id}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">{word.ru}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {word.en}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Typography variant="h3">Start a mode</Typography>
        {MODES.map(({ label, href }) => (
          <Link
            key={href}
            href={`/lists/${listId}/${href}`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined" fullWidth>
              {label}
            </Button>
          </Link>
        ))}
      </Stack>
    </>
  );
}
