import PhotoTag from '@/tag/PhotoTag';
import { isTagFavs } from '.';
import FavsTag from './FavsTag';
import { EntityLinkExternalProps } from '@/components/primitives/EntityLink';
import { Fragment } from 'react';
import { convertTagToRecipe, isTagRecipe } from '@/recipe';
import PhotoRecipe from '@/recipe/PhotoRecipe';

export default function PhotoTags({
  tags,
  contrast,
  prefetch,
}: {
  tags: string[]
} & EntityLinkExternalProps) {
  return (
    <div className="flex flex-col">
      {tags.map(tag =>
        <Fragment key={tag}>
          {isTagRecipe(tag)
            ? <PhotoRecipe {...{
              recipe: convertTagToRecipe(tag),
              recipeOnClick: () => console.log('clicked'),
            }} />
            : isTagFavs(tag)
              ? <FavsTag {...{ contrast, prefetch }} />
              : <PhotoTag {...{ tag, contrast, prefetch }} />}
        </Fragment>)}
    </div>
  );
}
