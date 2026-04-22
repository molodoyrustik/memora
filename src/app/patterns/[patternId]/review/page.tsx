import { ReviewMode } from "@/features/pattern-review";

type ReviewPageProps = {
  params: Promise<{ patternId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { patternId } = await params;
  return <ReviewMode patternId={patternId} />;
}
