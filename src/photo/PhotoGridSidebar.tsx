import { Cameras } from '@/camera';
import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { photoQuantityText } from '.';

export default function PhotoGridSidebar({
  tags,
  cameras,
  photosCount,
}: {
  tags: string[]
  cameras: Cameras
  photosCount: number
}) {
  return (
    <>
      {tags.length > 0 && <HeaderList
        title='Tags'
        icon={<FaTag size={12} />}
        items={tags.map(tag =>
          <PhotoTag
            key={tag}
            tag={tag}
            showIcon={false}
          />)}
      />}
      {cameras.length > 0 && <HeaderList
        title="Cameras"
        icon={<IoMdCamera size={13} />}
        items={cameras.map(({ cameraKey, camera }) =>
          <PhotoCamera
            key={cameraKey}
            camera={camera}
            showIcon={false}
            hideApple
          />)}
      />}
      {photosCount > 0 &&
        <div className="text-dim uppercase">
          {photoQuantityText(photosCount, false)}
        </div>}
    </>
  );
}
