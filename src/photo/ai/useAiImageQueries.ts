import { useCallback, useState } from 'react';
import useAiImageQuery from './useAiImageQuery';
import useTitleCaptionAiImageQuery from './useTitleCaptionAiImageQuery';

export type AiContent = ReturnType<typeof useAiImageQueries>;

export default function useAiImageQueries() {
  const [imageData, setImageData] = useState<string>();

  const isReady = Boolean(imageData);

  const [
    requestTitleCaption,
    title,
    caption,
    isLoadingTitleCaption,
  ] = useTitleCaptionAiImageQuery(imageData);

  const [
    requestTags,
    tags,
    isLoadingTags,
  ] = useAiImageQuery(imageData, 'tags');

  const [
    requestSemantic,
    semanticDescription,
    isLoadingSemantic,
  ] = useAiImageQuery(imageData, 'description-semantic');

  const hasContent = Boolean(
    title ||
    caption ||
    tags ||
    semanticDescription
  );

  const isLoading =
    isLoadingTitleCaption ||
    isLoadingTags ||
    isLoadingSemantic;

  const request = useCallback(async () => {
    if (!isLoading) {
      console.log('REQUESTING ALL IMAGE QUERIES');
      requestTitleCaption();
      requestTags();
      requestSemantic();
    }
  }, [isLoading, requestTitleCaption, requestTags, requestSemantic]);

  return {
    request,
    title,
    caption,
    tags,
    semanticDescription,
    isReady,
    hasContent,
    isLoading,
    isLoadingTitleCaption,
    isLoadingTags,
    isLoadingSemantic,
    setImageData,
  };
}
