"use client";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useCoursesStore } from "@/shared/model/courses-store";

export function Courses() {
  const courses = useCoursesStore((s) => s.courses);
  const lessons = useCoursesStore((s) => s.lessons);

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h1">Courses</Typography>
          <Link href="/courses/new" style={{ textDecoration: "none" }}>
            <Button variant="contained">Create course</Button>
          </Link>
        </Stack>

        <Stack spacing={2}>
          {courses.length === 0 && (
            <Typography variant="body1" color="text.secondary">
              No courses yet. Create your first one.
            </Typography>
          )}
          {courses.map((course) => {
            const courseLessons = lessons
              .filter((l) => l.courseId === course.id)
              .sort((a, b) => a.order - b.order);
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={0.5}>
                          <Typography variant="h3">{course.title}</Typography>
                          {course.description && (
                            <Typography variant="body2" color="text.secondary">
                              {course.description}
                            </Typography>
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {courseLessons.length} {courseLessons.length === 1 ? "lesson" : "lessons"}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}
