import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Word } from "@/entities/word/model/types";

export function StepImageCheck({
  word,
  hint,
  onHasImage,
  onSkip,
}: {
  word: Word;
  hint?: string;
  onHasImage: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 160, py: 2 }} spacing={2}>
            <Typography variant="h1" textAlign="center">{word.ru}</Typography>
            <Typography variant="body2" color="text.secondary">Представь это</Typography>
            {hint && (
              <Typography variant="caption" color="text.secondary">{hint}</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={onHasImage}>Есть образ</Button>
        <Button variant="text" fullWidth color="inherit" onClick={onSkip}>Пропустить</Button>
      </Stack>
    </>
  );
}

export function StepSoundEncoding({
  word,
  value,
  onChange,
  onNext,
  onSkip,
}: {
  word: Word;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h2" textAlign="center">{word.en}</Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">{word.ru}</Typography>
            </Stack>
            <TextField
              label="Звуковая ассоциация"
              placeholder="Введите ассоциацию"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && onNext()}
              fullWidth
              autoFocus
            />
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={onNext} disabled={!value.trim()}>Next</Button>
        <Button variant="text" fullWidth color="inherit" onClick={onSkip}>Skip</Button>
      </Stack>
    </>
  );
}

export function StepSceneCreation({
  value,
  onChange,
  onSave,
  onSkip,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Соедини два образа
            </Typography>
            <TextField
              label="Сцена"
              placeholder="Опиши сцену"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && onSave()}
              fullWidth
              multiline
              minRows={3}
              autoFocus
            />
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        <Button variant="contained" fullWidth onClick={onSave} disabled={!value.trim()}>Save</Button>
        <Button variant="text" fullWidth color="inherit" onClick={onSkip}>Skip</Button>
      </Stack>
    </>
  );
}

export function StepFixation({
  word,
  soundAssociation,
  sceneDescription,
  onDone,
}: {
  word: Word;
  soundAssociation: string;
  sceneDescription: string;
  onDone: () => void;
}) {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h2">{word.en}</Typography>
              <Typography variant="body2" color="text.secondary">{word.ru}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">Ассоциация</Typography>
              <Typography variant="body1">{soundAssociation}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">Сцена</Typography>
              <Typography variant="body1">{sceneDescription}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Посмотри и проговори слово
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Button variant="contained" fullWidth onClick={onDone}>Done</Button>
    </>
  );
}
