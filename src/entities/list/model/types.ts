export type ListId = string;

export type LanguageCode = 'ru' | 'en';

export type List = {
  id: ListId;
  name: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  createdAt: string;
  updatedAt: string;
};
