import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatTag } from '@/tag';
import { TbChecklist } from 'react-icons/tb';
import { generateRecipeText, getPhotoWithRecipeFromPhotos } from '@/recipe';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { isStringFilmSimulation } from '@/platforms/fujifilm/simulation';
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
            'linear-gradient(to right, rgba(0, 0, 0, .5) 30%, transparent 60%)',
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
                  {isStringFilmSimulation(text) &&
                    <div tw="flex">
                      <PhotoFilmSimulationIcon
                        simulation={photo.filmSimulation}
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
