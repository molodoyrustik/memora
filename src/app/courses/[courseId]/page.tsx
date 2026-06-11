import { CourseDetails } from "@/features/course-details";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  return <CourseDetails courseId={courseId} />;
}
