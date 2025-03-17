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

const AdminAppInsightCode = [
  'noFork',
  'forkBehind',
] as const;
type AdminAppInsightCode = typeof AdminAppInsightCode[number];

const _INSIGHTS_TEMPLATE = [
  'noAi',
  'noAiRateLimiting',
  'noConfiguredDomain',
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
