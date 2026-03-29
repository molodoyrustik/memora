import { EncodingMode } from "@/features/word-encoding";

type EncodingPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function EncodingPage({ params }: EncodingPageProps) {
  const { listId } = await params;

  return <EncodingMode listId={listId} />;
}
