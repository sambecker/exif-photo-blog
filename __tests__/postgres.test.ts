/* eslint-disable @stylistic/max-len */
import {
  areOptionsSensitive,
  generateManyToManyValues,
  getOrderByFromOptions,
  getWheresFromOptions,
  PhotoQueryOptions,
} from '@/db';

describe('Postgres', () => {
  it('orders random photo queries with a stable recency stride', () => {
    expect(getOrderByFromOptions({ sortBy: 'random', limit: 3 }))
      .toBe('ORDER BY (ROW_NUMBER() OVER (ORDER BY taken_at DESC, id) - 1) % 6, taken_at DESC, id');
    expect(getOrderByFromOptions({ sortBy: 'random', limit: 6 }))
      .toBe('ORDER BY (ROW_NUMBER() OVER (ORDER BY taken_at DESC, id) - 1) % 12, taken_at DESC, id');
    expect(getOrderByFromOptions({ sortBy: 'random', limit: 0 }))
      .toBe('ORDER BY (ROW_NUMBER() OVER (ORDER BY taken_at DESC, id) - 1) % 2, taken_at DESC, id');
    expect(getOrderByFromOptions({ sortBy: 'takenAt' }))
      .toBe('ORDER BY taken_at DESC');
  });
  it('Create many to many values', () => {
    expect(generateManyToManyValues(['1'], ['3']))
      .toEqual({
        valueString: 'VALUES ($1,$2)',
        values: ['1', '3'],
      });
    expect(generateManyToManyValues(['1', '2'], ['3', '4', '5']))
      .toEqual({
        valueString: 'VALUES ($1,$2),($3,$4),($5,$6),($7,$8),($9,$10),($11,$12)',
        values: ['1', '3', '1', '4', '1', '5', '2', '3', '2', '4', '2', '5'],
      });
  });
  it('Filters photos by focal length of 0', () => {
    expect(getWheresFromOptions({ focal: 0 }))
      .toEqual({
        wheres: 'WHERE hidden IS NOT TRUE AND focal_length=$1',
        wheresValues: [0],
        lastValuesIndex: 2,
      });
    expect(getWheresFromOptions({ focal: 90 }))
      .toEqual({
        wheres: 'WHERE hidden IS NOT TRUE AND focal_length=$1',
        wheresValues: [90],
        lastValuesIndex: 2,
      });
    expect(getWheresFromOptions({}))
      .toEqual({
        wheres: 'WHERE hidden IS NOT TRUE',
        wheresValues: [],
        lastValuesIndex: 1,
      });
  });
  it('Excludes hidden photos unless explicitly requested', () => {
    expect(getWheresFromOptions({ hidden: 'exclude' }).wheres)
      .toBe('WHERE hidden IS NOT TRUE');
    expect(getWheresFromOptions({ hidden: 'only' }).wheres)
      .toBe('WHERE hidden IS TRUE');
    expect(getWheresFromOptions({ hidden: 'include' }).wheres)
      .toBe('');
    // Malformed values from client-invoked server actions
    for (const hidden of ['x', null, ['only'], true, 0]) {
      expect(getWheresFromOptions({ hidden } as unknown as PhotoQueryOptions).wheres)
        .toBe('WHERE hidden IS NOT TRUE');
    }
  });
  it('Treats non-excluding hidden options as sensitive', () => {
    expect(areOptionsSensitive({})).toBe(false);
    expect(areOptionsSensitive({ hidden: 'exclude' })).toBe(false);
    expect(areOptionsSensitive({ hidden: 'include' })).toBe(true);
    expect(areOptionsSensitive({ hidden: 'only' })).toBe(true);
    for (const hidden of ['x', null, ['only'], true, 0]) {
      expect(areOptionsSensitive({ hidden } as unknown as PhotoQueryOptions))
        .toBe(true);
    }
  });
});
