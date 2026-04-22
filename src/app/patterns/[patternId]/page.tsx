import { PatternDetails } from "@/features/pattern-details";

type PatternDetailPageProps = {
  params: Promise<{ patternId: string }>;
};

export default async function PatternDetailPage({
  params,
}: PatternDetailPageProps) {
  const { patternId } = await params;
  return <PatternDetails patternId={patternId} />;
}
