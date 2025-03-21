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
    _version,
    modifier,
  // eslint-disable-next-line max-len
  ] = /^SONY (ILCE|ILME)-([0-9]*)([a-ln-z]*)M*([0-9]*)([a-z]*)/gi.exec(model) ?? [];
  const version = parseInt(_version ?? '0');
  const versionRomanNumber = version > 1 && version < 10
    ? ` ${convertNumberToRomanNumeral(version)}`
    : undefined;
  if (type === 'ILCE' || type === 'ILME') {
    return type === 'ILCE'
      // eslint-disable-next-line max-len
      ? `A${series}${letter}${versionRomanNumber || version || ''}${modifier || ''}`
      : `FX${series}${_version}`;
  }
  return model;
};
