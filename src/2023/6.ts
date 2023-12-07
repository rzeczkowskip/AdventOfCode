import { multiplyArrayValues } from './support/array';
import { withInput } from './support/io';
import { strToInt } from './support/number';

type Record = { time: number; distance: number };

withInput(async (input) => {
  const [times, distances] = input
    .trim()
    .replace(/ +/g, '')
    .split('\n')
    .map((line) => {
      const [, ...values] = line.split(':');
      return values.map(strToInt);
    });

  const records: Record[] = times.map((time, i) => ({
    time,
    distance: distances[i],
  }));

  const wins: number[] = [];
  records.forEach((record) => {
    for (let holdTime = 1; holdTime < record.time; holdTime += 1) {
      const traveledDistance = holdTime * (record.time - holdTime);

      if (traveledDistance > record.distance) {
        const edgeTimesToRemove = holdTime * 2;
        wins.push(record.time - edgeTimesToRemove + 1);
        break;
      }
    }
  });

  return multiplyArrayValues(wins).toString();
});
