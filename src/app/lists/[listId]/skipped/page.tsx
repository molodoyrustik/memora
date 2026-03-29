import { SkippedMode } from "@/features/word-skipped";

type SkippedPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function SkippedPage({ params }: SkippedPageProps) {
  const { listId } = await params;

  return <SkippedMode listId={listId} />;
}
