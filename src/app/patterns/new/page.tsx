import { Container } from "@mui/material";
import { AddNewPattern } from "@/features/add-new-pattern";

type NewPatternPageProps = {
  searchParams: Promise<{ lessonId?: string; courseId?: string }>;
};

export default async function NewPatternPage({ searchParams }: NewPatternPageProps) {
  const { lessonId, courseId } = await searchParams;
  return (
    <Container>
      <AddNewPattern lessonId={lessonId} courseId={courseId} />
    </Container>
  );
}
