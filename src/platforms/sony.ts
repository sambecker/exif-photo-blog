import { convertNumberToRomanNumeral } from '@/utility/number';

export const MAKE_SONY = 'SONY';

export const isMakeSony = (make: string) =>
  make === MAKE_SONY;

export const formatSonyModel = (model: string) => {
  const [
    _,
    type,
    series,
    letter,
    version,
    modifier,
  // eslint-disable-next-line max-len
  ] = /^SONY (ILCE|ILME)-([0-9]*)([a-ln-z]*)M*([0-9]*)([a-z]*)/gi.exec(model) ?? [];
  const versionNumber = parseInt(version || '0');
  const versionRomanNumeral = versionNumber > 1 && versionNumber < 10
    ? ` ${convertNumberToRomanNumeral(versionNumber)}`
    : '';
  if (type === 'ILCE' || type === 'ILME') {
    return type === 'ILCE'
      ? `A${series}${letter}${versionRomanNumeral || version}${modifier}`
      : `FX${series}${version}`;
  }
  return model;
};
