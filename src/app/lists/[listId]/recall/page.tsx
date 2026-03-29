import { RecallMode } from "@/features/word-recall";

type RecallPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function RecallPage({ params }: RecallPageProps) {
  const { listId } = await params;

  return <RecallMode listId={listId} />;
}
