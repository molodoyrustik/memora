"use client";

import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCharacteristicsStore } from "@/shared/model/characteristics-store";

export default function NewCharacteristicPage() {
  const router = useRouter();
  const createCharacteristic = useCharacteristicsStore(
    (s) => s.createCharacteristic,
  );
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [example, setExample] = useState("");

  const canSave = key.trim().length > 0 && description.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    createCharacteristic({
      key: key.trim(),
      description: description.trim(),
      example: example.trim() || null,
    });
    router.push("/characteristics");
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3} maxWidth={480}>
        <Typography variant="h1">New characteristic</Typography>
        <TextField
          label="Key"
          required
          fullWidth
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoFocus
        />
        <TextField
          label="Description"
          required
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Example"
          fullWidth
          multiline
          minRows={2}
          value={example}
          onChange={(e) => setExample(e.target.value)}
        />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            Save
          </Button>
          <Button component={Link} href="/characteristics">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
