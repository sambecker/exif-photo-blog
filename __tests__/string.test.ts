import { parameterize } from '@/utility/string';

describe('String', () => {
  it('parameterizes', () => {
    expect(parameterize('my tag')).toBe('my-tag');
    expect(parameterize('My Tag')).toBe('my-tag');
    expect(parameterize('my_tag')).toBe('my-tag');
    expect(parameterize('person\'s tag')).toBe('persons-tag');
    expect(parameterize('"person\'s tag"')).toBe('persons-tag');
  });
});
