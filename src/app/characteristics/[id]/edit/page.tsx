"use client";

import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { Characteristic } from "@/entities/characteristic";
import { useCharacteristicsStore } from "@/shared/model/characteristics-store";

function EditForm({ item }: { item: Characteristic }) {
  const router = useRouter();
  const updateCharacteristic = useCharacteristicsStore(
    (s) => s.updateCharacteristic,
  );
  const [key, setKey] = useState(item.key);
  const [description, setDescription] = useState(item.description);
  const [example, setExample] = useState(item.example ?? "");

  const canSave = key.trim().length > 0 && description.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    updateCharacteristic(item.id, {
      key: key.trim(),
      description: description.trim(),
      example: example.trim() || null,
    });
    router.push("/characteristics");
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3} maxWidth={480}>
        <Typography variant="h1">Edit characteristic</Typography>
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

export default function EditCharacteristicPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");
  const item = useCharacteristicsStore((s) =>
    s.characteristics.find((c) => c.id === id),
  );

  if (!id) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Invalid link.
        </Typography>
        <Button component={Link} href="/characteristics" sx={{ mt: 2 }}>
          Back to characteristics
        </Button>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Typography variant="body1" color="text.secondary">
            Characteristic not found.
          </Typography>
          <Button component={Link} href="/characteristics" variant="outlined">
            Back to characteristics
          </Button>
        </Stack>
      </Container>
    );
  }

  return <EditForm key={item.id} item={item} />;
}
