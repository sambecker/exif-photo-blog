import { useCallback, useState } from 'react';
import useImageQuery from './useImageQuery';
import useTitleCaptionImageQuery from './useTitleCaptionImageQuery';

export type AiContent = ReturnType<typeof useImageQueries>;

export default function useImageQueries() {
  const [imageData, setImageData] = useState<string>();

  const isReady = Boolean(imageData);

  const [
    requestTitleCaption,
    title,
    caption,
    isLoadingTitleCaption,
  ] = useTitleCaptionImageQuery(imageData);

  const [
    requestTags,
    tags,
    isLoadingTags,
  ] = useImageQuery(imageData, 'tags');

  const [
    requestSemantic,
    semanticDescription,
    isLoadingSemantic,
  ] = useImageQuery(imageData, 'description-semantic');

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
