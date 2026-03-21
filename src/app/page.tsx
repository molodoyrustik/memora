import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

export default function HomePage() {
  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">Memora</Typography>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h2">MUI setup works</Typography>
              <Typography variant="body1">
                Base theme is connected successfully.
              </Typography>
              <Box>
                <Button variant="contained">Primary action</Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
