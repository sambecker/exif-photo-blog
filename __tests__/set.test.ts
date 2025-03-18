import {
  DEFAULT_CATEGORY_KEYS,
  getOrderedCategoriesFromString,
} from '@/category';

describe('set', () => {
  it('parses from string', () => {
    expect(getOrderedCategoriesFromString())
      .toStrictEqual(DEFAULT_CATEGORY_KEYS);
    
    expect(getOrderedCategoriesFromString(
      'cameras,recipes,tags,films,focal-lengths,lenses',
    )).toStrictEqual([
      'cameras',
      'recipes',
      'tags',
      'films',
      'focal-lengths',
      'lenses',
    ]);
    
    expect(getOrderedCategoriesFromString(
      'cameras, recipes, tags, films',
    )).toStrictEqual([
      'cameras',
      'recipes',
      'tags',
      'films',
    ]);
    
    expect(getOrderedCategoriesFromString(
      'cameras',
    )).toStrictEqual([
      'cameras',
    ]);
  });
});
