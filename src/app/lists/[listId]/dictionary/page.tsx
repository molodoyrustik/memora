import { DictionaryMode } from "@/features/word-dictionary";

type DictionaryPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function DictionaryPage({ params }: DictionaryPageProps) {
  const { listId } = await params;

  return <DictionaryMode listId={listId} />;
}
