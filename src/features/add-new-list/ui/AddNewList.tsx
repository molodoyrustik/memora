"use client";

import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/shared/model/app-store";

export function AddNewList() {
  const [name, setName] = useState("");
  const createList = useAppStore((state) => state.createList);
  const router = useRouter();

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const list = createList({ name: trimmed });
    router.push(`/lists/${list.id}`);
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">New List</Typography>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="List name"
                placeholder="e.g. Travel Vocabulary"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoFocus
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={!name.trim()}
              >
                Create
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
