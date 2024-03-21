import { useCallback, useEffect, useRef, useState } from 'react';
import useAiImageQuery from './useAiImageQuery';
import useTitleCaptionAiImageQuery from './useTitleCaptionAiImageQuery';

export type AiContent = ReturnType<typeof useAiImageQueries>;

export default function useAiImageQueries(
  shouldAutoGenerateText?: boolean,
) {
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

  const hasRunAllQueriesOnce = useRef(false);

  const request = useCallback(async () => {
    console.log('RUNNING ALL AI QUERIES');
    hasRunAllQueriesOnce.current = true;
    requestTitleCaption();
    requestTags();
    requestSemantic();
  }, [requestTitleCaption, requestTags, requestSemantic]);

  useEffect(() => {
    if (shouldAutoGenerateText && imageData) {
      if (!hasRunAllQueriesOnce.current) {
        request();
      }
    }
  }, [shouldAutoGenerateText, imageData, request]);

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
