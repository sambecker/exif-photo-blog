import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilms,
  getUniqueFocalLengths,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueTags,
  getPhotosInNeedOfUpdateCount,
} from '@/photo/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';
import { getAllInsights, getGitHubMetaForCurrentApp } from '.';
import { USED_DEPRECATED_ENV_VARS } from '@/app/config';

export default async function AdminAppInsights() {
  const [
    { count: photosCount, dateRange },
    { count: photosCountHidden },
    photosCountNeedSync,
    { count: photosCountPortrait },
    codeMeta,
    cameras,
    lenses,
    tags,
    recipes,
    films,
    focalLengths,
  ] = await Promise.all([
    getPhotosMeta({ hidden: 'include' }),
    getPhotosMeta({ hidden: 'only' }),
    getPhotosInNeedOfUpdateCount(),
    getPhotosMeta({ maximumAspectRatio: 0.9 }),
    getGitHubMetaForCurrentApp(),
    getUniqueCameras(),
    getUniqueLenses(),
    getUniqueTags(),
    getUniqueRecipes(),
    getUniqueFilms(),
    getUniqueFocalLengths(),
  ]);

  return (
    <AdminAppInsightsClient
      codeMeta={codeMeta}
      insights={getAllInsights({
        codeMeta,
        photosCount,
        photosCountNeedSync,
        photosCountPortrait,
      })}
      usedDeprecatedEnvVars={USED_DEPRECATED_ENV_VARS}
      photoStats={{
        photosCount,
        photosCountHidden,
        photosCountNeedSync,
        camerasCount: cameras.length,
        lensesCount: lenses.length,
        tagsCount: tags.length,
        recipesCount: recipes.length,
        filmsCount: films.length,
        focalLengthsCount: focalLengths.length,
        dateRange,
      }}
    />
  );
}
