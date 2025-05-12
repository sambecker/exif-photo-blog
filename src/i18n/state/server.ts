import { APP_LOCALE } from '@/app/config';
import { getTextForLocale } from '..';
import { generateI18NState } from '.';

export const getAppText = async () =>
  getTextForLocale(APP_LOCALE).then(generateI18NState);
