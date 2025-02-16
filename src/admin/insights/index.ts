import { PhotoDateRange } from '@/photo';

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

export const getInsightIndicator = ({
  forkBehind,
  noAiRateLimiting,
  outdatedPhotos,
}: AdminAppInsights) =>
  forkBehind ||
  noAiRateLimiting ||
  outdatedPhotos;
