"use client";

import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCoursesStore } from "@/shared/model/courses-store";

type CourseDetailsProps = {
  courseId: string;
};

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const router = useRouter();

  const course = useCoursesStore((s) => s.courses.find((c) => c.id === courseId));
  const allLessons = useCoursesStore((s) => s.lessons);
  const lessons = useMemo(
    () => allLessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order),
    [allLessons, courseId],
  );
  const createLesson = useCoursesStore((s) => s.createLesson);
  const deleteLesson = useCoursesStore((s) => s.deleteLesson);
  const deleteCourse = useCoursesStore((s) => s.deleteCourse);

  const [addingLesson, setAddingLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");

  if (!course) {
    return (
      <Stack spacing={2}>
        <Button variant="text" onClick={() => router.push("/courses")} size="small" sx={{ alignSelf: "flex-start" }}>
          ← Courses
        </Button>
        <Typography color="text.secondary">Course not found.</Typography>
      </Stack>
    );
  }

  function handleAddLesson() {
    const t = lessonTitle.trim();
    if (!t) return;
    createLesson({ courseId, title: t });
    setLessonTitle("");
    setAddingLesson(false);
  }

  function handleDeleteCourse() {
    deleteCourse(courseId);
    router.push("/courses");
  }

  return (
    <Stack spacing={3}>
      <Button
        variant="text"
        onClick={() => router.push("/courses")}
        size="small"
        sx={{ alignSelf: "flex-start" }}
      >
        ← Courses
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5}>
          <Typography variant="h1">{course.title}</Typography>
          {course.description && (
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
          )}
        </Stack>
        <Button size="small" color="error" variant="outlined" onClick={handleDeleteCourse}>
          Delete course
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Lessons</Typography>
        {!addingLesson && (
          <Button variant="contained" size="small" onClick={() => setAddingLesson(true)}>
            Add lesson
          </Button>
        )}
      </Stack>

      {addingLesson && (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Lesson title"
                size="small"
                fullWidth
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLesson()}
                autoFocus
              />
              <Button variant="contained" onClick={handleAddLesson} disabled={!lessonTitle.trim()}>
                Save
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setAddingLesson(false);
                  setLessonTitle("");
                }}
              >
                Cancel
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack spacing={1.5}>
        {lessons.length === 0 && !addingLesson && (
          <Typography variant="body1" color="text.secondary">
            No lessons yet. Add the first one.
          </Typography>
        )}
        {lessons.map((lesson, idx) => (
          <Card key={lesson.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Link
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  style={{ textDecoration: "none", color: "inherit", flex: 1 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                      {idx + 1}.
                    </Typography>
                    <Typography variant="h3">{lesson.title}</Typography>
                  </Stack>
                </Link>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteLesson(lesson.id)}
                  aria-label="Delete lesson"
                >
                  ✕
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
