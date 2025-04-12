import {
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  IS_VERCEL_GIT_PROVIDER_GITHUB,
  IS_DEVELOPMENT,
  APP_CONFIGURATION,
  MATTE_PHOTOS,
  IS_META_DESCRIPTION_CONFIGURED,
  IS_META_TITLE_CONFIGURED,
  CATEGORY_VISIBILITY,
  HAS_STATIC_OPTIMIZATION,
  GRID_HOMEPAGE_ENABLED,
  AI_TEXT_GENERATION_ENABLED,
} from '@/app/config';
import { PhotoDateRange } from '@/photo';
import { getGitHubMeta } from '@/platforms/github';

const BASIC_PHOTO_INSTALLATION_COUNT = 32;
const TAG_COUNT_THRESHOLD = 12;

const AdminAppInsightCode = [
  'noFork',
  'forkBehind',
] as const;
type AdminAppInsightCode = typeof AdminAppInsightCode[number];

const _INSIGHTS_TEMPLATE = [
  'noAi',
  'noAiRateLimiting',
  'noConfiguredDomain',
  'noConfiguredMeta',
  'photoMatting',
  'camerasFirst',
  'gridFirst',
  'noStaticOptimization',
] as const;
type AdminAppInsightRecommendation = typeof _INSIGHTS_TEMPLATE[number];

const _INSIGHTS_LIBRARY = [
  'outdatedPhotos',
] as const;
type AdminAppInsightLibrary = typeof _INSIGHTS_LIBRARY[number];

export type AdminAppInsight =
  AdminAppInsightCode |
  AdminAppInsightRecommendation |
  AdminAppInsightLibrary;

export type AdminAppInsights = Record<AdminAppInsight, boolean>

export type InsightsIndicatorStatus = 'blue' | 'yellow' | undefined;

export const hasTemplateRecommendations = (insights: AdminAppInsights) =>
  _INSIGHTS_TEMPLATE.some(insight => insights[insight]);

export interface PhotoStats {
  photosCount: number
  photosCountHidden: number
  photosCountOutdated: number
  camerasCount: number
  lensesCount: number
  tagsCount: number
  recipesCount: number
  filmsCount: number
  focalLengthsCount: number
  dateRange?: PhotoDateRange
}

export const getGitHubMetaForCurrentApp = () =>
  (IS_VERCEL_GIT_PROVIDER_GITHUB || IS_DEVELOPMENT)
    ? getGitHubMeta({
      owner: VERCEL_GIT_REPO_OWNER,
      repo: VERCEL_GIT_REPO_SLUG,
      branch: VERCEL_GIT_BRANCH,
      commit: VERCEL_GIT_COMMIT_SHA,
    })
    : undefined;

export const getSignificantInsights = ({
  codeMeta,
  photosCountOutdated,
}: {
  codeMeta: Awaited<ReturnType<typeof getGitHubMetaForCurrentApp>>
  photosCountOutdated: number
}) => {
  const {
    isAiTextGenerationEnabled,
    hasRedisStorage,
    hasDomain,
  } = APP_CONFIGURATION;

  return {
    forkBehind: Boolean(codeMeta?.isBehind),
    noAiRateLimiting: isAiTextGenerationEnabled && !hasRedisStorage,
    noConfiguredDomain: !hasDomain,
    outdatedPhotos: Boolean(photosCountOutdated),
  };
};

export const indicatorStatusForSignificantInsights = (
  insights: Awaited<ReturnType<typeof getSignificantInsights>>,
) => {
  const {
    forkBehind,
    noAiRateLimiting,
    noConfiguredDomain,
    outdatedPhotos,
  } = insights;

  if (noAiRateLimiting || noConfiguredDomain) {
    return 'yellow';
  } else if (forkBehind || outdatedPhotos) {
    return 'blue';
  }
};

export const getAllInsights = ({
  codeMeta,
  photosCountOutdated,
  photosCount,
  photosCountPortrait,
  tagsCount,
}: Parameters<typeof getSignificantInsights>[0] & {
  photosCount: number
  photosCountPortrait: number
  tagsCount: number
}) => ({
  ...getSignificantInsights({ codeMeta, photosCountOutdated }),
  noFork: !codeMeta?.isForkedFromBase && !codeMeta?.isBaseRepo,
  noAi: !AI_TEXT_GENERATION_ENABLED,
  noConfiguredMeta:
    !IS_META_TITLE_CONFIGURED ||
    !IS_META_DESCRIPTION_CONFIGURED,
  photoMatting: photosCountPortrait > 0 && !MATTE_PHOTOS,
  camerasFirst: (
    tagsCount > TAG_COUNT_THRESHOLD &&
    CATEGORY_VISIBILITY[0] !== 'cameras'
  ),
  gridFirst: (
    photosCount >= BASIC_PHOTO_INSTALLATION_COUNT &&
    !GRID_HOMEPAGE_ENABLED
  ),
  noStaticOptimization: !HAS_STATIC_OPTIMIZATION,
});
