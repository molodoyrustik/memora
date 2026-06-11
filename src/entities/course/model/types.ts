export type Course = {
  id: string;
  title: string;
  description: string | null;
  lessonIds: string[];
  createdAt: string;
  updatedAt: string;
};
