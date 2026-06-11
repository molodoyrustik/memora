"use client";

import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCoursesStore } from "@/shared/model/courses-store";

export function AddNewCourse() {
  const router = useRouter();
  const createCourse = useCoursesStore((s) => s.createCourse);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    const t = title.trim();
    if (!t) return;
    const id = createCourse({ title: t, description: description.trim() || undefined });
    router.push(`/courses/${id}`);
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button variant="text" onClick={() => router.push("/courses")} size="small">
            ← Courses
          </Button>
        </Stack>

        <Typography variant="h1">New course</Typography>

        <Stack spacing={2}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <TextField
            label="Description (optional)"
            fullWidth
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!title.trim()}
          sx={{ alignSelf: "flex-start" }}
        >
          Create course
        </Button>
      </Stack>
    </Container>
  );
}
