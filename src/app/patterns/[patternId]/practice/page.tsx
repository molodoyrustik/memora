import { redirect } from "next/navigation";

// Old /practice route — redirected to the canonical First Pass route
type Props = { params: Promise<{ patternId: string }> };

export default async function LegacyPracticePage({ params }: Props) {
  const { patternId } = await params;
  redirect(`/patterns/${patternId}/first-pass`);
}
