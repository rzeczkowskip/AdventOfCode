import { sumArrayValues } from './support/array';
import { withReadInput } from './support/io';

withReadInput(async (input) => {
  const lines = input
    .replace(/ +/g, ' ')
    .split('\n')
    .map((line) => {
      const [card, numbers] = line.split(':');

      const cardNumber = Number.parseInt(card.substring(5).trim(), 10);
      const [winningNumbers, drawnNumbers] = numbers.split('|').map((values) =>
        values
          .trim()
          .split(' ')
          .map((value) => Number.parseInt(value.trim(), 10)),
      );

      return { cardNumber, winningNumbers, drawnNumbers };
    });

  const numberHits = lines.map((line) => {
    let hits = 0;

    line.drawnNumbers.forEach((number) => {
      if (line.winningNumbers.includes(number)) {
        hits += 1;
      }
    });

    return hits;
  });

  return sumArrayValues(
    numberHits.map((hits) => (hits === 0 ? 0 : 2 ** (hits - 1))),
  ).toString();
});
