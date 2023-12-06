import { withReadInput } from './support/io';

const strToInt = (value: string) => Number.parseInt(value.trim(), 10);

type Map = {
  source: string;
  destination: string;
  getMapping: (from: number) => number;
};

type Maps = Record<Map['source'], Map>;

type MapResult = Record<string, number>;

const buildMap = (mapString: string): Map => {
  const lines = mapString.split('\n');
  const description = lines.shift() as string;

  const [, source, destination] =
    description.match(/^(.+)-to-(.+) map:$/) || [];

  if (!source || !description) {
    throw new Error('Invalid map description (first line).');
  }

  const mapping = lines.map((line) => {
    const [destinationStart, sourceStart, count] = line
      .split(' ')
      .map(strToInt);

    const sourceMin = sourceStart;
    const sourceMax = sourceStart + count - 1;

    return {
      sourceMin,
      sourceMax,
      destinationStart,
    };
  });

  return {
    source,
    destination,
    getMapping: (value: number): number => {
      const configCandidate = mapping.find(
        (config) => value >= config.sourceMin && value <= config.sourceMax,
      );

      if (!configCandidate) {
        return value;
      }

      return (
        configCandidate.destinationStart + (value - configCandidate.sourceMin)
      );
    },
  };
};

const getResult = (type: string, value: number, maps: Maps): MapResult => {
  if (!maps[type]) {
    return {};
  }

  const map = maps[type];
  const nextValue = map.getMapping(value);

  return {
    [map.destination]: nextValue,
    ...getResult(map.destination, nextValue, maps),
  };
};

withReadInput(async (input) => {
  const mapStrings: string[] = input.split('\n\n');

  const seedsString = mapStrings.shift() as string;
  const seeds = seedsString
    .substring(seedsString.indexOf(': ') + 1)
    .trim()
    .split(' ')
    .map(strToInt);

  const maps: Maps = Object.fromEntries(
    mapStrings.map((mapString) => {
      const map = buildMap(mapString);

      return [map.source, map];
    }),
  );

  const result = seeds.map((seed) => getResult('seed', seed, maps));

  const minLocation = result.reduce(
    (previousValue, currentValue) =>
      Math.min(previousValue, currentValue.location),
    Number.MAX_SAFE_INTEGER,
  );

  return minLocation.toString();
});
