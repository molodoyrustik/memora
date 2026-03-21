import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function SelectionPage() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2">Selection Mode</Typography>
            <Typography variant="body1" color="text.secondary">
              Choose the words you want to learn.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
