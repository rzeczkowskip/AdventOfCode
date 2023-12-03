import { sumArrayValues } from './support/array';
import { withReadInput } from './support/io';

withReadInput(async (input) => {
  const lines = input.split('\n').map((line) => line.trim());

  // { [line number]: position in line[] }
  const capturePositions: Record<number, { from: number; to: number }[]> =
    Object.fromEntries(
      Array(lines.length + 2)
        .fill(true)
        .map((_, i) => [i - 1, []]),
    );

  lines.forEach((line, lineNumber) => {
    for (let i = 0; i < line.length; i += 1) {
      if (line[i].match(/[0-9.]/)) {
        continue;
      }

      const inLinePositions = { from: i - 1, to: i + 1 };
      capturePositions[lineNumber - 1].push(inLinePositions);
      capturePositions[lineNumber].push(inLinePositions);
      capturePositions[lineNumber + 1].push(inLinePositions);
    }
  });

  const numbers: number[] = [];
  lines.forEach((line, lineNumber) => {
    const matches = [...line.matchAll(/([0-9]+)/g)];

    matches.forEach((match) => {
      const value = match[0];
      const { index: numberStart = 0 } = match;
      const numberEnd = numberStart + value.length - 1;

      if (
        capturePositions[lineNumber].some(
          ({ from: rangeStart, to: rangeEnd }) =>
            (numberStart >= rangeStart && numberStart <= rangeEnd) ||
            (numberEnd >= rangeStart && numberEnd <= rangeEnd),
        )
      ) {
        numbers.push(Number.parseInt(value, 10));
      }
    });
  });

  return sumArrayValues(numbers).toString();
});
