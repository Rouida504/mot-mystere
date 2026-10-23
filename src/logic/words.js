import motsSolutions5 from "./mots-solutions.json";
import { WORDS_6 } from "./words6";
import { WORDS_7 } from "./words7";

export const WORDS_BY_LENGTH = {
  5: motsSolutions5,
  6: WORDS_6,
  7: WORDS_7,
};

export function getRandomWord(length = 5) {
  const list = WORDS_BY_LENGTH[length] || WORDS_BY_LENGTH[5];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex].toUpperCase();
}