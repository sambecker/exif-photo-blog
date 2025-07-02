import { ComponentProps, ReactNode, useEffect } from 'react';
import SharedHover from '../shared-hover/SharedHover';
import { Photo } from '@/photo';
import { useSharedHoverState } from '../shared-hover/state';

export default function EntityHover({
  title,
  icon,
  photoCount,
  getPhotos,
  children,
  ...props
}: {
  title: string
  icon?: ReactNode
  photoCount?: number
  getPhotos: () => Promise<Photo[]>
} & Omit<ComponentProps<typeof SharedHover>, 'content'>) {
  const { isHoverBeingShown } = useSharedHoverState();

  const isHovering = isHoverBeingShown?.(props.hoverKey);

  useEffect(() => {
    if (isHovering) {
      console.log('getting photos');
      getPhotos();
    }
  }, [isHovering, getPhotos]);

  return <SharedHover
    {...props}
    content={<>
      {title}
      {icon}
      {photoCount && <div>
        {photoCount} photos
      </div>}
    </>}
  >
    {children}
  </SharedHover>;
}
