"use client";

import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function NewListPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">New List</Typography>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="List name"
                placeholder="e.g. Travel Vocabulary"
                fullWidth
              />
              <Button variant="contained" fullWidth>
                Create
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
