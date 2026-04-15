export type LanguageCode = "ru" | "en";

export type List = {
  id: string;
  name: string;
  description: string | null;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  createdAt: string;
  updatedAt: string;
};
