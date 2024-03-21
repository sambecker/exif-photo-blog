import { useState } from 'react';
import { PhotoFormData, formHasTextContent } from '.';
import useAiImageQueries from '../ai/useAiImageQueries';

export default function usePhotoFormParent({
  photoForm,
  shouldAutoGenerateText,
}: {
  photoForm?: Partial<PhotoFormData>,
  shouldAutoGenerateText?: boolean,
} = {}) {
  const [pending, setIsPending] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [hasTextContent, setHasTextContent] =
    useState(photoForm ? formHasTextContent(photoForm) : false);

  const aiContent = useAiImageQueries(shouldAutoGenerateText);

  return {
    pending,
    setIsPending,
    updatedTitle,
    setUpdatedTitle,
    hasTextContent,
    setHasTextContent,
    aiContent,
  };
}
