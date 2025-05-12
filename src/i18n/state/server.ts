import { APP_LOCALE } from '@/app/config';
import { getTextForLocale } from '..';
import { generateAppTextState } from '.';

export const getAppText = () =>
  getTextForLocale(APP_LOCALE).then(generateAppTextState);
