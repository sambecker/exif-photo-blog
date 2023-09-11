'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { Photo } from '.';
import { routeForPhoto } from '@/site/routes';
import IconButton from '@/components/IconButton';
import { TbPhotoShare } from 'react-icons/tb';
import { cc } from '@/utility/css';

export default function SharePhotoButton({
  photo,
  prefetch,
}: {
  photo: Photo
  prefetch?: boolean
}) {
  const router = useRouter();
  
  const shareRoute = routeForPhoto(photo, true);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (prefetch) {
      router.prefetch(shareRoute);
    }
  }, [prefetch, router, shareRoute]);

  return (
    <IconButton
      onClick={() => startTransition(() =>
        router.push(shareRoute))}
      isLoading={isPending}
      className={cc(
        'min-h-[1.75rem]',
        'active:translate-y-[1px]',
        'text-gray-500 active:text-gray-600',
        'dark:text-gray-400 dark:active:text-gray-300',
      )}
    >
      <TbPhotoShare size={17} />
    </IconButton>
  );
}
