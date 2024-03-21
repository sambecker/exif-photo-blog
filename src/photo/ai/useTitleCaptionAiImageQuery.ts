import { useMemo } from 'react';
import useAiImageQuery from './useAiImageQuery';
import { parseTitleAndCaption } from '.';

export default function useTitleCaptionAiImageQuery(
  imageBase64: string | undefined,
) {
  const [
    request,
    text,
    isLoading,
    error,
  ] = useAiImageQuery(imageBase64, 'title-and-caption');

  const { title, caption } = useMemo(() =>
    parseTitleAndCaption(text), [text]);

  const isLoadingTitle = isLoading && !caption;
  const isLoadingCaption = isLoading;

  return [
    request,
    title,
    caption,
    isLoadingTitle,
    isLoadingCaption,
    error,
  ] as const;
}
