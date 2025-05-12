import { enUS, ptBR, pt } from 'date-fns/locale';
import { APP_LOCALE } from '@/app/config';

const getDateFnLocale = (locale: string) => {
  switch (locale) {
  case 'pt-pt': return pt;
  case 'pt-br': return ptBR;
  default: return enUS;
  }
};

export const DATE_FN_LOCALE = getDateFnLocale(APP_LOCALE);
