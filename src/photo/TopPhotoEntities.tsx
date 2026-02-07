import PhotoCamera from '@/camera/PhotoCamera';
import { PhotoSetCategories } from '@/category';
import MaskedScroll from '@/components/MaskedScroll';
import PhotoAlbum from '@/album/PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import PhotoFavs from '@/tag/PhotoFavs';
import clsx from 'clsx/lite';
import { CATEGORY_VISIBILITY } from '@/app/config';
import PhotoRecents from '@/recents/PhotoRecents';
import PhotoFilm from '@/film/PhotoFilm';
import PhotoFocalLength from '@/focal/PhotoFocalLength';
import PhotoLens from '@/lens/PhotoLens';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import LoaderButton from '@/components/primitives/LoaderButton';
import { useAppState } from '@/app/AppState';
import { ComponentProps, useMemo } from 'react';
import EntityLink from '@/components/entity/EntityLink';
import { useAppText } from '@/i18n/state/client';
import { getTopEntities } from '@/category/mobile';
import { BiExpandVertical } from 'react-icons/bi';

const ENTITY_LINK_PROPS: Partial<ComponentProps<typeof EntityLink>> = {
  badged: true,
  badgeType: 'medium',
  truncate: false,
  suppressSpinner: true,
};

export default function TopPhotoEntities({
  className,
  ...categories
}: PhotoSetCategories & {
  className?: string
}) {
  const { setIsCommandKOpen } = useAppState();

  const { utility } = useAppText();

  const {
    hasFavs,
    hasRecents,
    albums,
    tags,
    camera,
    lens,
    recipe,
    film,
    focal,
  } = useMemo(() => getTopEntities(categories), [categories]);

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
      {hasFavs &&
        <PhotoFavs
          {...ENTITY_LINK_PROPS}
          badgeIconFirst
        />}
      {hasRecents &&
        <PhotoRecents
          key="recents"
          {...ENTITY_LINK_PROPS}
        />}
      {albums.map(({ album }) =>
        <PhotoAlbum
          key={album.id}
          album={album}
          {...ENTITY_LINK_PROPS}
        />,
      )}
      {tags.map(({ tag }) =>
        <PhotoTag
          key={tag}
          tag={tag}
          {...ENTITY_LINK_PROPS}
        />,
      )}
      {CATEGORY_VISIBILITY
        .map(category => {
          switch (category) {
            case 'cameras': return camera &&
              <PhotoCamera
                key="cameras"
                camera={camera}
                {...ENTITY_LINK_PROPS}
              />;
            case 'lenses': return lens &&
              <PhotoLens
                key="lenses"
                lens={lens}
                {...ENTITY_LINK_PROPS}
              />;
            case 'recipes': return recipe &&
              <PhotoRecipe
                key="recipes"
                recipe={recipe}
                {...ENTITY_LINK_PROPS}
              />;
            case 'films': return film &&
              <PhotoFilm
                key="films"
                film={film}
                {...ENTITY_LINK_PROPS}
              />;
            case 'focal-lengths': return focal &&
              <PhotoFocalLength
                key="focal-lengths"
                focal={focal}
                {...ENTITY_LINK_PROPS}
              />;
          }
        })}
      <LoaderButton
        icon={<BiExpandVertical
          className="text-medium translate-y-[0.75px] text-[0.9rem]"
        />}
        onClick={() => setIsCommandKOpen?.(true)}
        hideText="never"
        className={clsx(
          'h-auto pt-[5px] pb-1.5 pl-1 pr-2.5',
          'gap-x-[3px] uppercase tracking-wide',
        )}
      >
        {utility.more}
      </LoaderButton>
    </MaskedScroll>
  );
}
