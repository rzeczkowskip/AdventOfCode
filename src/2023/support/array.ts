// eslint-disable-next-line import/prefer-default-export
export const sumArrayValues = (values: number[]): number =>
  values.reduce((previous, current) => previous + current, 0);
