import * as io from './support/io';
import { writeLine } from './support/io';

(async () => {
  const firstInput = await io.readMultilineInput('Paste first input:');

  const calibrationValues = firstInput.split('\n').map((data) => {
    const digits = data.replace(/[^\d]*/g, '');

    if (digits.length === 0) {
      throw new Error('No digits found');
    }

    return Number.parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
  });

  const sum = calibrationValues.reduce((prev, curr) => prev + curr, 0);
  writeLine('The first answer is: ', sum.toString());
})();
