export type CharacteristicId = string;

export type Characteristic = {
  id: CharacteristicId;
  key: string;
  description: string;
  example: string | null;
  createdAt: string;
  updatedAt: string;
};
