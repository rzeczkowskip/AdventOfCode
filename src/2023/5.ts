import { splitToChunks } from './support/array';
import { withReadInput } from './support/io';

const strToInt = (value: string) => Number.parseInt(value.trim(), 10);

// type Map = {
//   source: string;
//   destination: string;
//   getMapping: (from: number) => number;
// };
//
// type Maps = Record<Map['source'], Map>;
//
// type MapResult = Record<string, number>;
//
// const buildMap = (mapString: string): Map => {
//   const lines = mapString.split('\n');
//   const description = lines.shift() as string;
//
//   const [, source, destination] =
//     description.match(/^(.+)-to-(.+) map:$/) || [];
//
//   if (!source || !description) {
//     throw new Error('Invalid map description (first line).');
//   }
//
//   const mapping = lines.map((line) => {
//     const [destinationStart, sourceStart, count] = line
//       .split(' ')
//       .map(strToInt);
//
//     const sourceMin = sourceStart;
//     const sourceMax = sourceStart + count - 1;
//
//     return {
//       sourceMin,
//       sourceMax,
//       destinationStart,
//     };
//   });
//
//   return {
//     source,
//     destination,
//     getMapping: (value: number): number => {
//       const configCandidate = mapping.find(
//         (config) => value >= config.sourceMin && value <= config.sourceMax,
//       );
//
//       if (!configCandidate) {
//         return value;
//       }
//
//       return (
//         configCandidate.destinationStart + (value - configCandidate.sourceMin)
//       );
//     },
//   };
// };
//
// const getResult = (type: string, value: number, maps: Maps): MapResult => {
//   if (!maps[type]) {
//     return {};
//   }
//
//   const map = maps[type];
//   const nextValue = map.getMapping(value);
//
//   return {
//     [map.destination]: nextValue,
//     ...getResult(map.destination, nextValue, maps),
//   };
// };
//
// withReadInput(async (input) => {
//   const mapStrings: string[] = input.split('\n\n');
//
//   const seedsString = mapStrings.shift() as string;
//   const seeds = seedsString
//     .substring(seedsString.indexOf(': ') + 1)
//     .trim()
//     .split(' ')
//     .map(strToInt);
//
//   const maps: Maps = Object.fromEntries(
//     mapStrings.map((mapString) => {
//       const map = buildMap(mapString);
//
//       return [map.source, map];
//     }),
//   );
//
//   const result = seeds.map((seed) => getResult('seed', seed, maps));
//
//   const minLocation = result.reduce(
//     (previousValue, currentValue) =>
//       Math.min(previousValue, currentValue.location),
//     Number.MAX_SAFE_INTEGER,
//   );
//
//   return minLocation.toString();
// });

// BRUTE FORCE TAKES TOO LONG
// HAD TO GO BACK TO SCHOOL TO LEARN MATH :D

type Range = { start: number; end: number; length: number };

type MapValues = {
  destinationStart: number;
  sourceStart: number;
  length: number;
};

const buildMap = (mapString: string): MapValues[] => {
  const lines = mapString.split('\n');
  lines.shift();

  const values = lines.map((line): MapValues => {
    const [destinationStart, sourceStart, length] = line
      .split(' ')
      .map(strToInt);

    return { destinationStart, sourceStart, length };
  });

  values.sort((a, b) => b.destinationStart - a.destinationStart);

  return values;
};

const intersectRanges = (a: Range, b: Range): Range => {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  const length = end - start;

  return { start, end, length };
};

const subtractRanges = (a: Range, b: Range): Range[] => {
  const result: Range[] = [];

  if (a.start < b.start) {
    const length = b.start - a.start;
    result.push({
      start: a.start,
      length,
      end: a.start + length,
    });
  }

  if (a.end > b.end) {
    const length = a.end - b.end;
    result.push({
      start: b.end,
      length,
      end: b.end + length,
    });
  }

  return result;
};

const mapRanges = (maps: MapValues[], ranges: Range[]) => {
  const mappedRanges: Range[] = [];
  let updatedRanges = ranges;

  maps.forEach(({ destinationStart, sourceStart, length }) => {
    let restOfRanges: Range[] = [];

    updatedRanges.forEach((range) => {
      const intersection = intersectRanges(range, {
        start: sourceStart,
        length,
        end: sourceStart + length,
      });

      if (intersection.length > 0) {
        const start = intersection.start - sourceStart + destinationStart;
        mappedRanges.push({
          start,
          length: intersection.length,
          end: start + intersection.length,
        });

        const subResult = subtractRanges(range, {
          start: sourceStart,
          length,
          end: sourceStart + length,
        });

        restOfRanges = [...restOfRanges, ...subResult];
      } else {
        restOfRanges.push(range);
      }
    });

    updatedRanges = restOfRanges;
  });

  return [...mappedRanges, ...updatedRanges];
};

withReadInput(async (input) => {
  const [seedsString, ...mapStrings] = input.split('\n\n');

  const seedRanges: Range[] = splitToChunks(
    seedsString
      .substring(seedsString.indexOf(': ') + 1)
      .trim()
      .split(' ')
      .map(strToInt),
    2,
  ).map(([start, length]) => ({
    start,
    length,
    end: start + length,
  }));

  const maps = mapStrings.map(buildMap);

  const locations = maps.reduce(
    (previous, current) => mapRanges(current, previous),
    seedRanges,
  );

  return Math.min(...locations.map((location) => location.start)).toString();
});
