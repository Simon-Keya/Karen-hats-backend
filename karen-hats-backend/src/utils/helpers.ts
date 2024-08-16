import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (): string => {
  return uuidv4();
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
