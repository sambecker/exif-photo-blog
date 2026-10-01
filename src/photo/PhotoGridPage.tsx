import { ComponentProps } from 'react';
import PhotoGridPageClient from './PhotoGridPageClient';
import {
  htmlHasBrParagraphBreaks,
  safelyParseFormattedHtml,
} from '@/utility/html';
import {
  HOME_FOLDERS_ENABLED,
  SHOW_CATEGORIES_ON_MOBILE,
  SIDEBAR_TEXT,
} from '@/app/config';
import { hasEnoughTopEntities } from '@/category/mobile';
import { getAppText } from '@/i18n/state/server';
import { getTopEntityFolders } from '@/library/data';

export default async function PhotoGridPage(
  props: Omit<ComponentProps<typeof PhotoGridPageClient>,
    'aboutTextSafelyParsedHtml' |
    'aboutTextHasBrParagraphBreaks' |
    'folders'
  >,
) {
  const aboutTextSafelyParsedHtml = SIDEBAR_TEXT
    ? safelyParseFormattedHtml(SIDEBAR_TEXT)
    : undefined;
  const aboutTextHasBrParagraphBreaks = SIDEBAR_TEXT
    ? htmlHasBrParagraphBreaks(SIDEBAR_TEXT)
    : false;

  const folders = HOME_FOLDERS_ENABLED &&
    SHOW_CATEGORIES_ON_MOBILE &&
    hasEnoughTopEntities(props)
    ? await getTopEntityFolders(props, await getAppText())
      .catch(() => [])
    : undefined;

  return <PhotoGridPageClient {...{
    ...props,
    aboutTextSafelyParsedHtml,
    aboutTextHasBrParagraphBreaks,
    folders,
  }} />;
}
