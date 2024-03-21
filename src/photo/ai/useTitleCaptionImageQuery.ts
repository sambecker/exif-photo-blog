import { useMemo } from 'react';
import useImageQuery from './useImageQuery';

export default function useTitleCaptionImageQuery(
  imageBase64: string | undefined,
) {
  const [
    request,
    text,
    isLoading,
    error,
  ] = useImageQuery(imageBase64, 'title-and-caption');

  const { title, caption } = useMemo(() => {
    const matches = text.includes('Title')
      ? text.match(/^[`']*Title: "*(.*?)\.*"* Caption: "*(.*?)\.*"*[`']*$/)
      : text.match(/^(.*?): (.*?)$/);

    return {
      title: matches?.[1] ?? '',
      caption: matches?.[2] ?? '',
    };
  }, [text]);

  return [
    request,
    title,
    caption,
    isLoading,
    error,
  ] as const;
}
