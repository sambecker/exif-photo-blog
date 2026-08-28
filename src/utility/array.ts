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

// Fisher-Yates, as sorting by a random comparator is measurably biased
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
