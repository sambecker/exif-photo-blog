import { parameterize, depluralize } from '@/utility/string';

describe('String', () => {
  it('parameterizes', () => {
    expect(parameterize('my-tag')).toBe('my-tag');
    expect(parameterize('my tag')).toBe('my-tag');
    expect(parameterize('My Tag')).toBe('my-tag');
    expect(parameterize('my_tag')).toBe('my-tag');
    expect(parameterize('person\'s tag')).toBe('persons-tag');
    expect(parameterize('"person\'s tag"')).toBe('persons-tag');
    expect(parameterize('宿宿宿宿')).toBe('宿宿宿宿');
  });
  it('depluralizes', () => {
    expect(depluralize('lenses')).toBe('lens');
    expect(depluralize('cameras')).toBe('camera');
    expect(depluralize('tags')).toBe('tag');
    expect(depluralize('recipes')).toBe('recipe');
    expect(depluralize('films')).toBe('film');
  });
});
