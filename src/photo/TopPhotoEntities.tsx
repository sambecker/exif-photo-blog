import PhotoCamera from '@/camera/PhotoCamera';
import { PhotoSetCategories } from '@/category';
import MaskedScroll from '@/components/MaskedScroll';
import PhotoAlbum from '@/album/PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import PhotoFavs from '@/tag/PhotoFavs';
import clsx from 'clsx';
import {
  CATEGORY_VISIBILITY,
  SHOW_ALBUMS,
  SHOW_RECENTS,
  SHOW_TAGS,
} from '@/app/config';
import PhotoRecents from '@/recents/PhotoRecents';
import PhotoFilm from '@/film/PhotoFilm';
import PhotoFocalLength from '@/focal/PhotoFocalLength';
import PhotoLens from '@/lens/PhotoLens';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import { getTopNonFavTags, tagsHaveFavs } from '@/tag';
import LoaderButton from '@/components/primitives/LoaderButton';
import { useAppState } from '@/app/AppState';
import { ComponentProps } from 'react';
import EntityLink from '@/components/entity/EntityLink';
import { LuPlus } from 'react-icons/lu';
import { useAppText } from '@/i18n/state/client';

const MAX_ALBUMS = 3;
const MAX_TAGS = 3;

const ENTITY_LINK_PROPS: Partial<ComponentProps<typeof EntityLink>> = {
  badged: true,
  badgeType: 'medium',
  truncate: false,
  suppressSpinner: true,
};

export default function TopPhotoEntities({
  className,
  recents,
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
  const { setIsCommandKOpen } = useAppState();

  const { utility } = useAppText();

  return (
    <MaskedScroll
      direction="horizontal"
      className={clsx(
        'flex whitespace-nowrap gap-x-3',
        // Prevent shadow clipping
        'py-1',
        className,
      )}
      fadeSize={50}
    >
      {tagsHaveFavs(tags) &&
        <PhotoFavs
          {...ENTITY_LINK_PROPS}
          badgeIconFirst
        />}
      {SHOW_RECENTS && recents.length > 0 &&
        <PhotoRecents
          key="recents"
          {...ENTITY_LINK_PROPS}
        />}
      {SHOW_ALBUMS && albums.slice(0, MAX_ALBUMS).map(({ album }) =>
        <PhotoAlbum
          key={album.id}
          album={album}
          {...ENTITY_LINK_PROPS}
        />,
      )}
      {SHOW_TAGS && getTopNonFavTags(tags).slice(0, MAX_TAGS).map(({ tag }) =>
        <PhotoTag
          key={tag}
          tag={tag}
          {...ENTITY_LINK_PROPS}
        />,
      )}
      {CATEGORY_VISIBILITY
        .filter(category =>
          category !== 'recents' &&
          category !== 'years' &&
          category !== 'albums' &&
          category !== 'tags',
        )
        .map(category => {
          switch (category) {
            case 'cameras': return cameras.length > 0 &&
              <PhotoCamera
                key="cameras"
                camera={cameras[0].camera}
                {...ENTITY_LINK_PROPS}
              />;
            case 'lenses': return lenses.length > 0 &&
              <PhotoLens
                key="lenses"
                lens={lenses[0].lens}
                {...ENTITY_LINK_PROPS}
              />;
            case 'recipes': return recipes.length > 0 &&
              <PhotoRecipe
                key="recipes"
                recipe={recipes[0].recipe}
                {...ENTITY_LINK_PROPS}
              />;
            case 'films': return films.length > 0 &&
              <PhotoFilm
                key="films"
                film={films[0].film}
                {...ENTITY_LINK_PROPS}
              />;
            case 'focal-lengths': return focalLengths.length > 0 &&
              <PhotoFocalLength
                key="focal-lengths"
                focal={focalLengths[0].focal}
                {...ENTITY_LINK_PROPS}
              />;
          }
        })}
      <LoaderButton
        icon={<LuPlus className="text-[0.95rem] translate-y-[1px]" />}
        onClick={() => setIsCommandKOpen?.(true)}
        hideText="never"
        className={clsx(
          'h-auto pt-1 pb-1.5 pl-1 pr-2',
          'gap-x-1 uppercase',
        )}
      >
        {utility.more}
      </LoaderButton>
    </MaskedScroll>
  );
}
