import { useMemo } from 'react';
import useAiImageQuery from './useAiImageQuery';

export default function useTitleCaptionAiImageQuery(
  imageBase64: string | undefined,
) {
  const [
    request,
    text,
    isLoading,
    error,
  ] = useAiImageQuery(imageBase64, 'title-and-caption');

  const { title, caption } = useMemo(() => {
    const matches = text.includes('Title')
      ? text.match(/^[`']*Title: "*(.*?)"* Caption: "*(.*?)\.*"*[`']*$/)
      : text.match(/^(.*?): (.*?)$/);

    return {
      title: matches?.[1] ?? '',
      caption: matches?.[2] ?? '',
    };
  }, [text]);

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
