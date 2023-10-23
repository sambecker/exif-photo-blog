import { Cameras } from '@/camera';
import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { photoQuantityText } from '.';
import { Tags } from '@/tag';

export default function PhotoGridSidebar({
  tags,
  cameras,
  photosCount,
}: {
  tags: Tags
  cameras: Cameras
  photosCount: number
}) {
  return (
    <>
      {tags.length > 0 && <HeaderList
        title='Tags'
        icon={<FaTag size={12} className="text-icon" />}
        items={tags.map(({ tag, count }) =>
          <PhotoTag
            key={tag}
            tag={tag}
            showIcon={false}
            countOnHover={count}
          />)}
      />}
      {cameras.length > 0 && <HeaderList
        title="Cameras"
        icon={<IoMdCamera
          size={13}
          className="text-icon translate-y-[-0.25px]"
        />}
        items={cameras.map(({ cameraKey, camera, count }) =>
          <PhotoCamera
            key={cameraKey}
            camera={camera}
            showIcon={false}
            countOnHover={count}
            hideApple
          />)}
      />}
      {photosCount > 0 && <HeaderList
        items={[photoQuantityText(photosCount, false)]}
      />}
    </>
  );
}
