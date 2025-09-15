import type { Photo } from '../photo';
import ImageCaption from '../image-response/components/ImageCaption';
import ImagePhotoGrid from '../image-response/components/ImagePhotoGrid';
import ImageContainer from '../image-response/components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatTag } from '@/tag';
import { generateRecipeLines, getRecipePropsFromPhotos } from '@/recipe';
import PhotoFilmIcon from '@/film/PhotoFilmIcon';
import {
  isStringFujifilmSimulationLabel,
} from '@/platforms/fujifilm/simulation';
import IconRecipe from '@/components/icons/IconRecipe';
const MAX_RECIPE_LINES = 8;

export default function RecipeImageResponse({
  recipe,
  photos,
  width,
  height,
  fontFamily,
  smallText = true,
}: {
  recipe: string,
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
  smallText?: boolean
}) {
  const { data, film } = getRecipePropsFromPhotos(photos) ?? {};

  let recipeLines = data && film
    ? generateRecipeLines({ data, film }, true)
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
        }}
      />
      <div
        tw="flex absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(0, 0, 0, .5) 30%, transparent 60%)',
        }}
      />
      <ImageCaption {...{
        width,
        height,
        fontFamily,
        legacyBottomAlignment: false,
        gap: '0',
        icon: <IconRecipe
          size={height * .087}
          style={{
            transform: `translateY(${height * .002}px)`,
            marginRight: height * .02,
          }}
        />,
        title: formatTag(recipe).toLocaleUpperCase(),
      }}>
        {data &&
          <div
            // tw="opacity-70"
            style={{
              display: 'flex',
              flexDirection: 'column',
              ...smallText ? {
                paddingTop: height * .04,
                lineHeight: 1.45,
                letterSpacing: '0.04em',
                fontSize: height * .06,
              } : {
                paddingTop: height * .02,
                opacity: 0.7,
              },              
            }}
          >
            {recipeLines.map(text => (
              <div tw="flex" key={text}>
                <div
                  tw="flex"
                  style={{
                    width: height * .143,
                  }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: height * .0325,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  flexGrow: 1,
                }}>
                  {text}
                  {isStringFujifilmSimulationLabel(text) && film &&
                    <div tw="flex">
                      <PhotoFilmIcon
                        film={film}
                        height={height * .06}
                        style={{ transform: `translateY(${-height * .001}px)`}}
                      />
                    </div>}
                </div>
              </div>
            ))}
          </div>}
      </ImageCaption>
    </ImageContainer>
  );
}
