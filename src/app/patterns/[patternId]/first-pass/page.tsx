import { FirstPassMode } from "@/features/pattern-first-pass";

type FirstPassPageProps = {
  params: Promise<{ patternId: string }>;
};

export default async function FirstPassPage({ params }: FirstPassPageProps) {
  const { patternId } = await params;
  return <FirstPassMode patternId={patternId} />;
}
