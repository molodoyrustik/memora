import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function SkippedPage() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2">Skipped Mode</Typography>
            <Typography variant="body1" color="text.secondary">
              Review the words you skipped earlier.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
