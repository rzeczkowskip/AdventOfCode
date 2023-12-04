import { sumArrayValues } from './support/array';
import { withReadInput } from './support/io';

withReadInput(async (input) => {
  const cardCopiesCount: Record<number, number> = {};

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

      cardCopiesCount[cardNumber] = 1;
      return { cardNumber, winningNumbers, drawnNumbers };
    });

  lines.forEach((line) => {
    let hits = 0;
    const copies = cardCopiesCount[line.cardNumber] || 0;

    if (copies === 0) {
      return;
    }

    line.drawnNumbers.forEach((number) => {
      if (line.winningNumbers.includes(number)) {
        hits += 1;
      }
    });

    for (let i = line.cardNumber + 1; i <= line.cardNumber + hits; i += 1) {
      cardCopiesCount[i] += copies;
    }
  });

  return sumArrayValues(Object.values(cardCopiesCount)).toString();
});
