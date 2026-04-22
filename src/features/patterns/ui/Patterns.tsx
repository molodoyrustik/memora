"use client";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo } from "react";
import { usePatternsStore } from "@/shared/model/patterns-store";

export function Patterns() {
  const patterns = usePatternsStore((s) => s.patterns);
  const patternSentences = usePatternsStore((s) => s.patternSentences);

  const sentenceCountByPatternId = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of patternSentences) {
      map.set(s.patternId, (map.get(s.patternId) ?? 0) + 1);
    }
    return map;
  }, [patternSentences]);

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h1">Patterns</Typography>
          <Button component={Link} href="/patterns/new" variant="contained">
            New pattern
          </Button>
        </Stack>

        {patterns.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No patterns yet. Create one to start practicing grammar.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {patterns.map((pattern) => {
              const count = sentenceCountByPatternId.get(pattern.id) ?? 0;
              return (
                <Card key={pattern.id}>
                  <CardActionArea
                    component={Link}
                    href={`/patterns/${pattern.id}`}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="h3">{pattern.name}</Typography>
                          {pattern.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {pattern.description}
                            </Typography>
                          )}
                        </Stack>
                        <Chip
                          label={`${count} ${count === 1 ? "sentence" : "sentences"}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
