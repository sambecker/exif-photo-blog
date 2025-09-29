import PhotoCamera from '@/camera/PhotoCamera';
import { PhotoSetCategories } from '@/category';
import MaskedScroll from '@/components/MaskedScroll';
import PhotoAlbum from '@/album/PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import PhotoFavs from '@/tag/PhotoFavs';
import PhotoYear from '@/year/PhotoYear';
import clsx from 'clsx';

export default function PhotoMobileSidebar({
  className,
  ...categories
}: PhotoSetCategories & {
  className?: string
}) {
  return (
    <MaskedScroll
      direction="horizontal"
      className={clsx(
        'whitespace-nowrap space-x-2',
        // Tighten badge lockups
        '*:*:*:*:gap-1',
        className,
      )}
      fadeSize={50}
    >
      <PhotoFavs badged badgeIconFirst />
      <PhotoAlbum album={categories.albums[0].album} badged />
      <PhotoYear year={categories.years[0].year} badged />
      <PhotoTag tag={categories.tags[2].tag} badged />
      <PhotoCamera camera={categories.cameras[0].camera} badged />
    </MaskedScroll>
  );
}
