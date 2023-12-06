// eslint-disable-next-line import/prefer-default-export
export const sumArrayValues = (values: number[]): number =>
  values.reduce((previous, current) => previous + current, 0);

export const multiplyArrayValues = (values: number[]): number =>
  values.reduce((previous, current) => previous * current, 1);

export const splitToChunks = <T>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
};
