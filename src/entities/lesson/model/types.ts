export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  wordListIds: string[];
  patternListIds: string[];
  createdAt: string;
  updatedAt: string;
};
