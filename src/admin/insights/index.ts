import {
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  IS_VERCEL_GIT_PROVIDER_GITHUB,
  IS_DEVELOPMENT,
  APP_CONFIGURATION,
} from '@/app/config';
import { PhotoDateRange } from '@/photo';
import { getGitHubMeta } from '@/platforms/github';

export type AdminAppInsight =
  'noFork' |
  'forkBehind' |
  'noAi' |
  'noAiRateLimiting' |
  'outdatedPhotos' |
  'photoMatting' |
  'gridFirst' |
  'noStaticOptimization';

const RECOMMENDATIONS: AdminAppInsight[] = [
  'noAi',
  'noAiRateLimiting',
  'photoMatting',
  'gridFirst',
  'noStaticOptimization',
];

export type AdminAppInsights = Record<AdminAppInsight, boolean>

export type InsightIndicatorStatus = 'blue' | 'yellow' | undefined;

export const hasTemplateRecommendations = (insights: AdminAppInsights) =>
  RECOMMENDATIONS.some(insight => insights[insight]);

export interface PhotoStats {
  photosCount: number
  photosCountHidden: number
  photosCountOutdated: number
  tagsCount: number
  camerasCount: number
  filmSimulationsCount: number
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
  } = APP_CONFIGURATION;

  return {
    forkBehind: Boolean(codeMeta?.isBehind),
    noAiRateLimiting: isAiTextGenerationEnabled && !hasRedisStorage,
    outdatedPhotos: Boolean(photosCountOutdated),
  };
};
