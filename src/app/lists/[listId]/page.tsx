import { ListDetails } from "@/features/list-details";

type ListDetailPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { listId } = await params;

  return <ListDetails listId={listId} />;
}
