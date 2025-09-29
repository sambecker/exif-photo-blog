import PhotoCamera from '@/camera/PhotoCamera';
import { PhotoSetCategories } from '@/category';
import MaskedScroll from '@/components/MaskedScroll';
import PhotoAlbum from '@/album/PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import PhotoFavs from '@/tag/PhotoFavs';
import PhotoYear from '@/year/PhotoYear';
import clsx from 'clsx';
import { CATEGORY_VISIBILITY } from '@/app/config';
import PhotoRecents from '@/recents/PhotoRecents';
import PhotoFilm from '@/film/PhotoFilm';
import PhotoFocalLength from '@/focal/PhotoFocalLength';
import PhotoLens from '@/lens/PhotoLens';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import { tagsHaveFavs } from '@/tag';

export default function PhotoGridSidebarMobile({
  className,
  recents,
  years,
  cameras,
  lenses,
  albums,
  tags,
  recipes,
  films,
  focalLengths,
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
      {tagsHaveFavs(tags) &&
        <PhotoFavs badged badgeIconFirst />}
      {CATEGORY_VISIBILITY.map(category => {
        switch (category) {
          case 'recents': return recents.length > 0 &&
            <PhotoRecents key="recents" badged />;
          case 'years': return years.length > 0 &&
            <PhotoYear key="years" year={years[0].year} badged />;
          case 'cameras': return cameras.length > 0 &&
            <PhotoCamera key="cameras" camera={cameras[0].camera} badged />;
          case 'lenses': return lenses.length > 0 &&
            <PhotoLens key="lenses" lens={lenses[0].lens} badged />;
          case 'albums': return albums.length > 0 &&
            <PhotoAlbum key="albums" album={albums[0].album} badged />;
          case 'tags': return tags.length > 0 &&
            <PhotoTag key="tags" tag={tags[2].tag} badged />;
          case 'recipes': return recipes.length > 0 &&
            <PhotoRecipe key="recipes" recipe={recipes[0].recipe} badged />;
          case 'films': return films.length > 0 &&
            <PhotoFilm key="films" film={films[0].film} badged />;
          case 'focal-lengths': return focalLengths.length > 0 &&
            <PhotoFocalLength
              key="focal-lengths"
              focal={focalLengths[0].focal}
              badged
            />;
        }
      })}
    </MaskedScroll>
  );
}
