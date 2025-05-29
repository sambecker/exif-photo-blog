import { ComponentProps } from 'react';
import PhotoGridPageClient from './PhotoGridPageClient';
import {
  htmlHasBrParagraphBreaks,
  safelyParseFormattedHtml,
} from '@/utility/html';
import { PAGE_ABOUT } from '@/app/config';

export default function PhotoGridPage(
  props: ComponentProps<typeof PhotoGridPageClient>,
) {
  const aboutTextSafelyParsedHtml = PAGE_ABOUT
    ? safelyParseFormattedHtml(PAGE_ABOUT)
    : undefined;
  const aboutTextHasBrParagraphBreaks = PAGE_ABOUT
    ? htmlHasBrParagraphBreaks(PAGE_ABOUT)
    : false;

  return <PhotoGridPageClient {...{
    ...props,
    aboutTextSafelyParsedHtml,
    aboutTextHasBrParagraphBreaks,
  }} />;
}
