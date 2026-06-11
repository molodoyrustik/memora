import { AddNewList } from "@/features/add-new-list";

type NewListPageProps = {
  searchParams: Promise<{ lessonId?: string; courseId?: string }>;
};

export default async function NewListPage({ searchParams }: NewListPageProps) {
  const { lessonId, courseId } = await searchParams;
  return <AddNewList lessonId={lessonId} courseId={courseId} />;
}
