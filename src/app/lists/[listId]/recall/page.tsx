import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function RecallPage() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2">Recall Mode</Typography>
            <Typography variant="body1" color="text.secondary">
              Test yourself — recall the words from memory.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
