"use client";

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
import { useAppStore } from "@/shared/model/store/store";

export default function ListsPage() {
  const lists = useAppStore((state) => state.lists);
  const getListWords = useAppStore((state) => state.getListWords);

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
          {lists.length === 0 && (
            <Typography variant="body1">No lists found</Typography>
          )}
          {lists.map((list) => (
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
                        {getListWords(list.id).length} words
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
