import { useEffect, useState } from 'react';
import { getPhotoAction } from './actions';
import { Photo } from '.';
import { useDebounce } from 'use-debounce';

export default function useDynamicPhoto({
  initialPhoto,
  photoId,
}: {
  initialPhoto?: Photo
  photoId?: string
}) {
  const [photo, setPhoto] = useState(initialPhoto);

  const [isLoading, setIsLoading] = useState(false);

  const [photoIdDebounced] = useDebounce(photoId, 500, { leading: true });

  useEffect(() => {
    if (photoIdDebounced) {
      if (photoIdDebounced !== photo?.id) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        getPhotoAction(photoIdDebounced).then(setPhoto)
          .finally(() => setIsLoading(false));
      }
    } else {
      setPhoto(undefined);
      setIsLoading(false);
    }
  }, [photoIdDebounced, photo?.id]);

  return { photo, isLoading };
}
