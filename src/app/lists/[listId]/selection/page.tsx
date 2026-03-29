import { SelectionMode } from "@/features/word-selection";

type SelectionPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function SelectionPage({ params }: SelectionPageProps) {
  const { listId } = await params;

  return <SelectionMode listId={listId} />;
}
