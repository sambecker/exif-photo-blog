/* eslint-disable max-len */
import {
  generateManyToManyValues,
  getOrderByFromOptions,
  getWheresFromOptions,
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
});
