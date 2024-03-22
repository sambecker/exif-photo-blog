import { useCallback, useEffect, useState } from 'react';
import useAiImageQuery from './useAiImageQuery';
import { parseTitleAndCaption } from '.';

export default function useTitleCaptionAiImageQuery(
  imageBase64: string | undefined,
) {
  const [
    request,
    text,
    isLoading,
    _reset,
    error,
  ] = useAiImageQuery(imageBase64, 'title-and-caption');

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  useEffect(() => {
    const { title, caption } = parseTitleAndCaption(text);
    setTitle(title);
    setCaption(caption);
  }, [text]);

  const resetTitle = useCallback(() => setTitle(''), []);
  const resetCaption = useCallback(() => setCaption(''), []);

  const isLoadingTitle = isLoading && !caption;
  const isLoadingCaption = isLoading;

  return [
    request,
    title,
    caption,
    isLoadingTitle,
    isLoadingCaption,
    resetTitle,
    resetCaption,
    error,
  ] as const;
}
