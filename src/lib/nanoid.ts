import { customAlphabet } from "nanoid";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const nanoid = customAlphabet(alphabet, 21);
export const shortId = customAlphabet(alphabet, 12);
