import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatTag } from '@/tag';
import { TbChecklist } from 'react-icons/tb';
import { generateRecipeText, getPhotoWithRecipeFromPhotos } from '@/recipe';

const MAX_RECIPE_LINES = 8;

export default function RecipeImageResponse({
  recipe,
  photos,
  width,
  height,
  fontFamily,
}: {
  recipe: string,
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
}) {
  const photo = getPhotoWithRecipeFromPhotos(photos);

  let recipeLines = photo?.recipeData && photo.filmSimulation
    ? generateRecipeText({
      recipe: photo.recipeData,
      simulation: photo.filmSimulation!,
      iso: photo.iso!.toString(),
    })
    : [];

  if (recipeLines && recipeLines.length > MAX_RECIPE_LINES) {
    recipeLines = recipeLines.slice(0, MAX_RECIPE_LINES);
    recipeLines[MAX_RECIPE_LINES - 1] = '•••';
  }

  return (
    <ImageContainer solidBackground={photos.length === 0}>
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
          gap: 0,
        }}
      />
      <div
        tw="flex absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(0, 0, 0, .5) 40%, transparent 75%)',
        }}
      />
      <ImageCaption {...{
        width,
        height,
        fontFamily,
        legacyBottomAlignment: false,
        gap: '0',
        icon: <TbChecklist
          size={height * .087}
          style={{
            transform: `translateY(${height * .003}px)`,
            marginRight: height * .02,
          }}
        />,
        title: formatTag(recipe).toLocaleUpperCase(),
      }}>
        {photo?.recipeData &&
          <div
            tw="opacity-60"
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: height * .03,
              lineHeight: 1.22,
            }}
          >
            {recipeLines.map(text => (
              <div tw="flex" key={text}>
                <div
                  tw="flex"
                  style={{
                    width: height * .141,
                  }}
                />
                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  flexGrow: 1,
                }}>
                  {text}
                </div>
              </div>
            ))}
          </div>}
      </ImageCaption>
    </ImageContainer>
  );
}
