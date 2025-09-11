import {
  DEFAULT_CATEGORY_KEYS,
  parseOrderedCategoriesFromString,
} from '@/category';

describe('set', () => {
  it('parses from string', () => {
    expect(parseOrderedCategoriesFromString())
      .toStrictEqual(DEFAULT_CATEGORY_KEYS);
    
    expect(parseOrderedCategoriesFromString(
      'cameras,recipes,tags,films,focal-lengths,lenses',
    )).toStrictEqual([
      'cameras',
      'recipes',
      'tags',
      'films',
      'focal-lengths',
      'lenses',
    ]);
    
    expect(parseOrderedCategoriesFromString(
      'cameras, recipes, tags, films',
    )).toStrictEqual([
      'cameras',
      'recipes',
      'tags',
      'films',
    ]);
    
    expect(parseOrderedCategoriesFromString(
      'cameras',
    )).toStrictEqual([
      'cameras',
    ]);
  });
});
