import { useCallback, useState } from 'react';
import { streamImageQueryAction } from '../actions';
import { readStreamableValue } from 'ai/rsc';
import { ImageQuery } from '.';

export default function useImageQuery(
  imageBase64: string | undefined,
  query: ImageQuery,
) {
  const [text, setText] = useState('');
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(async () => {
    if (imageBase64) {
      setIsLoading(true);
      try {
        const textStream = await streamImageQueryAction(
          imageBase64,
          query,
        );
        for await (const text of readStreamableValue(textStream)) {
          setText(text ?? '');
        }
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    }
  }, [imageBase64, query]);

  // Withhold streaming text if it's a null response
  const isTextError = text.toLocaleLowerCase().startsWith('sorry');

  return [
    request,
    isTextError ? '' : text,
    isLoading,
    error,
  ] as const;
};
