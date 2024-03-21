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
    isLoadingTitle,
    isLoadingCaption,
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
  ] = useAiImageQuery(imageData, 'description-small');

  const hasContent = Boolean(
    title ||
    caption ||
    tags ||
    semanticDescription
  );

  const isLoading =
    isLoadingTitle ||
    isLoadingCaption ||
    isLoadingTags ||
    isLoadingSemantic;

  const request = useCallback(async () => {
    if (!isLoading) {
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
    isLoadingTitle,
    isLoadingCaption,
    isLoadingTags,
    isLoadingSemantic,
    setImageData,
  };
}
