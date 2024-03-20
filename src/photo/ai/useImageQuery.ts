import { useCallback, useState } from 'react';
import { streamImageQueryAction } from '../actions';
import { readStreamableValue } from 'ai/rsc';
import { ImageQuery } from '.';

export default function useImageQuery(
  imageBase64: string | undefined,
  query: ImageQuery,
) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(async () => {
    if (imageBase64) {
      setIsLoading(true);
      const textStream = await streamImageQueryAction(
        imageBase64 ?? '',
        query,
      );
      for await (const text of readStreamableValue(textStream)) {
        setText(text ?? '');
      }
      setIsLoading(false);
    }
  }, [imageBase64, query]);

  return [
    request,
    text,
    isLoading,
  ] as const;
};
