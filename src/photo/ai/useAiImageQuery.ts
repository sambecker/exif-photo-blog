import { useCallback, useState } from 'react';
import { streamAiImageQueryAction } from '../actions';
import { readStreamableValue } from '@ai-sdk/rsc';
import { AiImageQuery } from '.';

export default function useAiImageQuery(
  imageBase64: string | undefined,
  query: AiImageQuery,
  existingTitle?: string,
) {
  const [text, setText] = useState('');
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(async () => {
    if (imageBase64) {
      setIsLoading(true);
      setText('');
      try {
        const textStream = await streamAiImageQueryAction(
          imageBase64,
          query,
          existingTitle,
        );
        for await (const text of readStreamableValue(textStream)) {
          setText(current => `${current}${text ?? ''}`);
        }
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    }
  }, [imageBase64, query, existingTitle]);

  const reset = useCallback(() => {
    setText('');
    setError(undefined);
    setIsLoading(false);
  }, []);

  // Withhold streaming text if it's a null response
  const isTextError = /^(I'*m )*sorry/i.test(text);

  return [
    request,
    isTextError ? '' : text,
    isLoading,
    reset,
    error,
  ] as const;
};
