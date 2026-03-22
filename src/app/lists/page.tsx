import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

const MOCK_LISTS = [
  { id: "1", name: "Basic Verbs", wordCount: 20 },
  { id: "2", name: "Travel Vocabulary", wordCount: 35 },
  { id: "3", name: "Business English", wordCount: 50 },
];

export default function ListsPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h1">Lists</Typography>
          <Link href="/lists/new" style={{ textDecoration: "none" }}>
            <Button variant="contained">Create list</Button>
          </Link>
        </Stack>

        <Stack spacing={2}>
          {MOCK_LISTS.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h3">{list.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {list.wordCount} words
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
