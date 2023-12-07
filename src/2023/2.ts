// import { writeLine } from './support/io';
import { multiplyArrayValues, sumArrayValues } from './support/array';
import { withInput } from './support/io';

type GameSet = Record<string, number>;
type Game = GameSet[];

// const EXPECTED_MAX: GameSet = {
//   red: 12,
//   green: 13,
//   blue: 14,
// };
//
// const isGamePossible = (game: Game, maxDrawnTypes: GameSet): boolean =>
//   game.every((set) =>
//     Object.entries(set).every(
//       ([type, count]) => type in maxDrawnTypes && count <= maxDrawnTypes[type],
//     ),
//   );

const extractExpectedMinimumRequiredTypes = (game: Game) => {
  const requiredByType: GameSet = {};
  game.forEach((set) => {
    Object.entries(set).forEach(([type, count]) => {
      if (!(type in requiredByType)) {
        requiredByType[type] = 0;
      }

      if (requiredByType[type] < count) {
        requiredByType[type] = count;
      }
    });
  });

  return requiredByType;
};

withInput(async (input) => {
  const gameStrings = input
    .replace(/(?:^Game [0-9]+: |([,;]) )/gm, '$1')
    .split('\n')
    .map((line) => line.split(';'));

  const games: Game[] = [];

  gameStrings.forEach((gameSetStrings) => {
    const game: Game = [];

    gameSetStrings.forEach((drawString) => {
      const set: GameSet = {};

      drawString.split(',').forEach((setString) => {
        setString.split(',').forEach((draw) => {
          const [count, type] = draw.split(' ');
          set[type] = Number.parseInt(count, 10);
        });
      });

      game.push(set);
    });

    games.push(game);
  });

  // const possibleGames: number[] = [];
  // games.forEach((game, i) => {
  //   if (isGamePossible(game, EXPECTED_MAX)) {
  //     possibleGames.push(i + 1);
  //   }
  // });
  //
  // return sumArrayValues(possibleGames).toString();

  const powers = games.map((game) =>
    Object.values(extractExpectedMinimumRequiredTypes(game)),
  );

  return sumArrayValues(powers.map(multiplyArrayValues)).toString();
});
