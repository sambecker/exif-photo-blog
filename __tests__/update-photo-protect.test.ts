import { PhotoDbInsert } from '@/photo';
import {
  FIELDS_TO_NOT_OVERWRITE_ON_EDIT,
  restoreProtectedFields,
} from '@/photo/form';

const makeExisting = (
  overrides: Partial<PhotoDbInsert> = {},
): PhotoDbInsert => ({
  id: 'abc123',
  url: 'https://example.com/photo.jpg',
  extension: 'jpg',
  aspectRatio: 1.5,
  takenAt: '2025-01-01T12:00:00.000Z',
  takenAtNaive: '2025-01-01 12:00:00',
  title: 'Existing Title',
  caption: 'Existing Caption',
  film: 'provia' as PhotoDbInsert['film'],
  recipeData: '{"foo":1}',
  tags: ['alpha', 'beta'],
  make: 'FUJIFILM',
  ...overrides,
});

const makeIncoming = (
  overrides: Partial<PhotoDbInsert> = {},
): PhotoDbInsert => ({
  id: 'abc123',
  url: 'https://example.com/photo.jpg',
  extension: 'jpg',
  aspectRatio: 1.5,
  takenAt: '2025-01-01T12:00:00.000Z',
  takenAtNaive: '2025-01-01 12:00:00',
  ...overrides,
});

describe('restoreProtectedFields', () => {
  it('protects title, film, recipeData, caption, and tags', () => {
    expect(FIELDS_TO_NOT_OVERWRITE_ON_EDIT).toEqual(
      expect.arrayContaining([
        'title',
        'film',
        'recipeData',
        'caption',
        'tags',
      ]),
    );
  });

  it('keeps existing title when incoming title is undefined', () => {
    const existing = makeExisting();
    const incoming = makeIncoming({ title: undefined });
    const result = restoreProtectedFields(incoming, existing);
    expect(result.title).toBe('Existing Title');
  });

  it('preserves a changed incoming title', () => {
    const existing = makeExisting();
    const incoming = makeIncoming({ title: 'New Title' });
    const result = restoreProtectedFields(incoming, existing);
    expect(result.title).toBe('New Title');
  });

  it('keeps existing tags when incoming tags is empty', () => {
    const existing = makeExisting();
    const incoming = makeIncoming({ tags: [] });
    const result = restoreProtectedFields(incoming, existing);
    expect(result.tags).toEqual(['alpha', 'beta']);
  });

  it('preserves non-empty incoming tags', () => {
    const existing = makeExisting();
    const incoming = makeIncoming({ tags: ['gamma'] });
    const result = restoreProtectedFields(incoming, existing);
    expect(result.tags).toEqual(['gamma']);
  });

  it('does not backfill a non-protected field (make)', () => {
    const existing = makeExisting({ make: 'FUJIFILM' });
    const incoming = makeIncoming({ make: undefined });
    const result = restoreProtectedFields(incoming, existing);
    expect(result.make).toBeUndefined();
  });

  it('does not mutate its inputs', () => {
    const existing = makeExisting();
    const incoming = makeIncoming({ title: undefined, tags: [] });
    restoreProtectedFields(incoming, existing);
    expect(incoming.title).toBeUndefined();
    expect(incoming.tags).toEqual([]);
  });
});
