function* chunkArrayGenerator<T>(
  array: T[],
  chunkSize: number,
): Generator<T[], void> {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] =>
  [...chunkArrayGenerator(array, chunkSize)];
