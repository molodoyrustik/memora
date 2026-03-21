import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function EncodingPage() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2">Encoding Mode</Typography>
            <Typography variant="body1" color="text.secondary">
              Memorize words using associations.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
