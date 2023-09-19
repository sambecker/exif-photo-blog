import { customAlphabet } from 'nanoid';

const NANOID_LENGTH = 8;

const NANOID_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateNanoid =
  customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);
