/* eslint-disable @stylistic/max-len */
import {
  areOptionsSensitive,
  generateManyToManyValues,
  getOrderByFromOptions,
  getWheresFromOptions,
  PhotoQueryOptions,
} from '@/db';
import { getPhotosForFolders } from '@/photo/query';
import { query } from '@/platforms/postgres';

jest.mock('../src/platforms/postgres', () => ({
  query: jest.fn(),
  sql: jest.fn(),
}));

const mockedQuery = query as jest.MockedFunction<typeof query>;

const DB_PHOTO_ROW = {
  id: 'photo001',
  url: 'https://example.test/photo.jpg',
  extension: 'jpg',
  aspect_ratio: 1.5,
  tags: ['street'],
  taken_at: new Date('2025-01-01T12:00:00.000Z'),
  taken_at_naive: '2025-01-01 12:00:00',
  updated_at: new Date('2025-01-01T12:00:00.000Z'),
  created_at: new Date('2025-01-01T12:00:00.000Z'),
};

describe('Postgres', () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });
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
  it('Batches folder photo queries with scoped parameters and strips folder_index', async () => {
    expect(await getPhotosForFolders([])).toEqual([]);
    expect(mockedQuery).not.toHaveBeenCalled();

    mockedQuery.mockResolvedValueOnce({
      rows: [
        { ...DB_PHOTO_ROW, id: 'photo000', folder_index: 0 },
        { ...DB_PHOTO_ROW, id: 'photo002', folder_index: 2 },
      ],
      rowCount: 2,
      command: 'SELECT',
      oid: 0,
      fields: [],
    });

    const folders = await getPhotosForFolders([
      { tag: 'favs', sortBy: 'random', limit: 3 },
      { year: '2024', sortBy: 'random', limit: 3 },
      { focal: 35, sortBy: 'random', limit: 3 },
    ]);

    expect(mockedQuery).toHaveBeenCalledTimes(1);
    const [sqlText, values] = mockedQuery.mock.calls[0];
    expect(sqlText).toContain('0 AS folder_index');
    expect(sqlText).toContain('1 AS folder_index');
    expect(sqlText).toContain('2 AS folder_index');
    expect(values).toEqual(['favs', 3, 0, '2024', 3, 0, 35, 3, 0]);

    expect(folders.map(f => f.map(p => p.id))).toEqual([
      ['photo000'],
      [],
      ['photo002'],
    ]);
    expect(folders[0][0]).not.toHaveProperty('folderIndex');
    expect(folders[0][0]).not.toHaveProperty('folder_index');
  });
  it('Chunks folder photo queries beyond 1000 folders', async () => {
    mockedQuery
      .mockResolvedValueOnce({
        rows: [{ ...DB_PHOTO_ROW, id: 'first', folder_index: 0 }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      })
      .mockResolvedValueOnce({
        rows: [{ ...DB_PHOTO_ROW, id: 'last', folder_index: 1000 }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

    const options = Array.from({ length: 1001 }, (_, i) => ({
      tag: `tag-${i}`,
      limit: 3,
    }));

    const folders = await getPhotosForFolders(options);

    expect(mockedQuery).toHaveBeenCalledTimes(2);
    expect(mockedQuery.mock.calls[1][1]).toEqual(['tag-1000', 3, 0]);
    expect(folders[0][0].id).toBe('first');
    expect(folders[1000][0].id).toBe('last');
  });
});
