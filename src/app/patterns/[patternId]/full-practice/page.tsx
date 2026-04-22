import { FullPracticeMode } from "@/features/pattern-full-practice";

type FullPracticePageProps = {
  params: Promise<{ patternId: string }>;
};

export default async function FullPracticePage({
  params,
}: FullPracticePageProps) {
  const { patternId } = await params;
  return <FullPracticeMode patternId={patternId} />;
}
