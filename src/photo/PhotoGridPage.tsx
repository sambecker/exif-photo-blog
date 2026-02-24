import { ComponentProps } from 'react';
import PhotoGridPageClient from './PhotoGridPageClient';
import {
  htmlHasBrParagraphBreaks,
  safelyParseFormattedHtml,
} from '@/utility/html';
import { SIDEBAR_TEXT } from '@/app/config';

export default function PhotoGridPage(
  props: ComponentProps<typeof PhotoGridPageClient>,
) {
  const aboutTextSafelyParsedHtml = SIDEBAR_TEXT
    ? safelyParseFormattedHtml(SIDEBAR_TEXT)
    : undefined;
  const aboutTextHasBrParagraphBreaks = SIDEBAR_TEXT
    ? htmlHasBrParagraphBreaks(SIDEBAR_TEXT)
    : false;

  return <PhotoGridPageClient {...{
    ...props,
    aboutTextSafelyParsedHtml,
    aboutTextHasBrParagraphBreaks,
  }} />;
}
