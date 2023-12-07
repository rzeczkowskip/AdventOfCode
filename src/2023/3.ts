import { multiplyArrayValues, sumArrayValues } from './support/array';
import { withInput } from './support/io';

withInput(async (input) => {
  const lines = input.split('\n').map((line) => line.trim());

  // { [line number]: position in line[] }
  const capturePositions: Record<
    number,
    { id: string; from: number; to: number; symbol: string }[]
  > = Object.fromEntries(
    Array(lines.length + 2)
      .fill(true)
      .map((_, i) => [i - 1, []]),
  );

  lines.forEach((line, lineNumber) => {
    for (let i = 0; i < line.length; i += 1) {
      if (line[i].match(/[0-9.]/)) {
        continue;
      }

      const inLinePositions = {
        from: i - 1,
        to: i + 1,
        id: `${lineNumber}-${i}`,
        symbol: line[i],
      };
      capturePositions[lineNumber - 1].push(inLinePositions);
      capturePositions[lineNumber].push(inLinePositions);
      capturePositions[lineNumber + 1].push(inLinePositions);
    }
  });

  const numbers: Record<string, { numbers: number[]; symbol: string }> = {};
  lines.forEach((line, lineNumber) => {
    const matches = [...line.matchAll(/([0-9]+)/g)];

    matches.forEach((match) => {
      const value = match[0];
      const { index: numberStart = 0 } = match;
      const numberEnd = numberStart + value.length - 1;

      capturePositions[lineNumber].forEach(({ id, symbol, from, to }) => {
        if (!numbers[id]) {
          numbers[id] = { symbol, numbers: [] };
        }

        const startInRange = numberStart >= from && numberStart <= to;
        const endInRange = numberEnd >= from && numberEnd <= to;

        if (startInRange || endInRange) {
          numbers[id].numbers.push(Number.parseInt(value, 10));
        }
      });
    });
  });

  const gearRatiosSum = sumArrayValues(
    Object.values(numbers).map((symbolNumbers) =>
      symbolNumbers.symbol === '*' && symbolNumbers.numbers.length === 2
        ? multiplyArrayValues(symbolNumbers.numbers)
        : 0,
    ),
  );
  return gearRatiosSum.toString();
});
