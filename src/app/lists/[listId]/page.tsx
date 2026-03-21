import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

const MOCK_WORDS = ["apple", "bridge", "cloud", "dream", "effort"];

const MODES = [
  { label: "Selection", href: "selection" },
  { label: "Encoding", href: "encoding" },
  { label: "Skipped", href: "skipped" },
  { label: "Recall", href: "recall" },
] as const;

type ListDetailPageProps = {
  params: Promise<{ listId: string }>;
};

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { listId } = await params;

  return (
    <>
      <Typography variant="h1">List details</Typography>

      <Card>
        <CardContent>
          <Stack spacing={1} divider={<Divider />}>
            {MOCK_WORDS.map((word) => (
              <Typography key={word} variant="body1">
                {word}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Typography variant="h3">Start a mode</Typography>
        {MODES.map(({ label, href }) => (
          <Link
            key={href}
            href={`/lists/${listId}/${href}`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined" fullWidth>
              {label}
            </Button>
          </Link>
        ))}
      </Stack>
    </>
  );
}
