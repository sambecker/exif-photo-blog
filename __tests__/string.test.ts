import {
  convertStringToArray,
  depluralize,
  parameterize,
  startsWithHangingPunctuation,
} from '@/utility/string';

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
  it('detects hanging punctuation', () => {
    expect(startsWithHangingPunctuation('“Quoted album”')).toBe(true);
    expect(startsWithHangingPunctuation('"Quoted album"')).toBe(true);
    expect(startsWithHangingPunctuation('‘Quoted album’')).toBe(true);
    expect(startsWithHangingPunctuation('—Em dash lead')).toBe(true);
    expect(startsWithHangingPunctuation('(Parenthetical)')).toBe(true);
    expect(startsWithHangingPunctuation('Plain description')).toBe(false);
    expect(startsWithHangingPunctuation('A “quote” later')).toBe(false);
  });
  it('converts comma-delimited strings to arrays', () => {
    expect(convertStringToArray('a,b,c')).toStrictEqual(['a', 'b', 'c']);
    expect(convertStringToArray('a, b, c', false))
      .toStrictEqual(['a', 'b', 'c']);
    expect(convertStringToArray()).toStrictEqual([]);
  });
  it('preserves commas when not splitting', () => {
    expect(convertStringToArray('RICOH IMAGING COMPANY, LTD.', false))
      .toStrictEqual(['RICOH IMAGING COMPANY', 'LTD.']);
    expect(convertStringToArray('RICOH IMAGING COMPANY, LTD.', false, false))
      .toStrictEqual(['RICOH IMAGING COMPANY, LTD.']);
    expect(convertStringToArray('XCD, 45P', false, false))
      .toStrictEqual(['XCD, 45P']);
  });
});
