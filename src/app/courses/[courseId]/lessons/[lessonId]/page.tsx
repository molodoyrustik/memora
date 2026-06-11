import { LessonDetails } from "@/features/lesson-details";

type LessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  return <LessonDetails courseId={courseId} lessonId={lessonId} />;
}
