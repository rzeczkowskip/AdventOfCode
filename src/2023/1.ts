import { sumArrayValues } from './support/array';
import { withInput } from './support/io';

const NUMBER_WORDS_TO_DIGITS_MAP: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const extractDigits = (input: string): number[] => {
  const digits: number[] = [];

  for (let i = 0; i < input.length; i += 1) {
    const asInt = Number.parseInt(input[i], 10);

    if (Number.isInteger(asInt) && !Number.isNaN(asInt)) {
      digits.push(asInt);
      continue;
    }

    Object.entries(NUMBER_WORDS_TO_DIGITS_MAP).forEach(([word, digit]) => {
      if (input.substring(i).startsWith(word)) {
        digits.push(digit);
      }
    });
  }

  return digits;
};

withInput(async (input) => {
  const calibrationValues = input.split('\n').map((data) => {
    const digits = extractDigits(data);

    if (digits.length === 0) {
      throw new Error('No digits found');
    }

    return Number.parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
  });

  return sumArrayValues(calibrationValues).toString();
});
