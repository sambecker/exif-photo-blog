import { TEXT as EN_US } from './locales/en-us';
import { setDefaultOptions } from 'date-fns';
// Dynamically resolves in next.config.ts
import locale from './date-fns-locale-alias';

export type I18N = typeof EN_US;

/**
 * TRANSLATION STEPS FOR CONTRIBUTORS:
 * 1. Create new file in `src/i18n/locales` modeled on `en-us.ts`—
 *    MAKE SURE to export a default date-fns locale
 * 3. Add import to `LOCALE_TEXT_IMPORTS`
 * 4. Test locally
 * 4. Add translation/credit to `README.md` Supported Languages
 */

const LOCALE_TEXT_IMPORTS: Record<
  string,
  () => Promise<I18N | undefined>
> = {
  'pt-br': () => import('./locales/pt-br').then(m => m.TEXT),
  'pt-pt': () => import('./locales/pt-pt').then(m => m.TEXT),
  'id-id': () => import('./locales/id-id').then(m => m.TEXT),
  'zh-cn': () => import('./locales/zh-cn').then(m => m.TEXT),
  'bd-bn': () => import('./locales/bd-bn').then(m => m.TEXT),
  'tr-tr': () => import('./locales/tr-tr').then(m => m.TEXT),
};

export const getTextForLocale = async (locale: string): Promise<I18N> => {
  const text = EN_US;
  Object.entries(
    await LOCALE_TEXT_IMPORTS[locale.toLocaleLowerCase()]?.() ?? {},
  )
    .forEach(([key, value]) => {
      // Fall back to English for missing keys
      text[key as keyof I18N] = {
        ...text[key as keyof I18N],
        ...value as any,
      };
    });

  return text;
};

export const setDefaultDateFnLocale = () => setDefaultOptions({ locale });
