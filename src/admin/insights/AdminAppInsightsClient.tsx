'use client';

import IconGrSync from '@/app-core/IconGrSync';
import ScoreCard from '@/components/ScoreCard';
import ScoreCardRow from '@/components/ScoreCardRow';
import { dateRangeForPhotos, PhotoDateRange } from '@/photo';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { FaCamera } from 'react-icons/fa';
import { FaTag } from 'react-icons/fa';
import { FaRegCalendar } from 'react-icons/fa6';
import {
  HiOutlinePhotograph,
  HiSparkles,
} from 'react-icons/hi';
import { MdLightbulbOutline } from 'react-icons/md';
import { PiWarningBold } from 'react-icons/pi';
import { TbCone } from 'react-icons/tb';
import { getGitHubMetaWithFallback } from '../github';
import { BiGitBranch, BiGitCommit, BiLogoGithub } from 'react-icons/bi';
import {
  TEMPLATE_REPO_BRANCH,
  TEMPLATE_REPO_OWNER,
  TEMPLATE_REPO_NAME,
  VERCEL_GIT_COMMIT_SHA_SHORT,
  VERCEL_GIT_COMMIT_MESSAGE,
} from '@/app-core/config';
import { AdminAppInsight } from '.';
import EnvVar from '@/components/EnvVar';
import { IoSyncCircle } from 'react-icons/io5';
import clsx from 'clsx/lite';

const DEBUG_COMMIT_SHA = '4cd29ed';
const DEBUG_COMMIT_MESSAGE = 'Long commit message for debugging purposes';

export default function AdminAppInsightsClient({
  codeMeta,
  recommendations: {
    noAi,
    noAiRateLimiting,
  },
  photoStats: {
    photosCount,
    photosCountHidden,
    tagsCount,
    camerasCount,
    filmSimulationsCount,
    lensesCount,
    dateRange,
  },
  debug,
}: {
  codeMeta?: Awaited<ReturnType<typeof getGitHubMetaWithFallback>>
  recommendations: Record<AdminAppInsight, boolean>
  photoStats: {
    photosCount: number
    photosCountHidden: number
    tagsCount: number
    camerasCount: number
    filmSimulationsCount: number
    lensesCount: number
    dateRange?: PhotoDateRange
  },
  debug?: boolean
}) {

  const { descriptionWithSpaces } = dateRangeForPhotos(undefined, dateRange);

  return (
    <div className="space-y-6 md:space-y-8">
      {(codeMeta?.isBaseRepo || codeMeta?.isForkedFromBase || debug) && <>
        <ScoreCard title="Build details">
          {(codeMeta?.behindBy || debug) &&
            <ScoreCardRow
              icon={<IoSyncCircle
                size={18}
                className="text-blue-500"
              />}
              content={<>
                This fork is
                {' '}
                <span className={clsx(
                  'text-blue-600 bg-blue-100/70',
                  'dark:text-blue-400 dark:bg-blue-900/50',
                  'px-1.5 pt-[1px] pb-0.5 rounded-md',
                )}>
                  {codeMeta?.behindBy ?? 9} commits
                </span>
                {' '}
                behind
              </>}
              additionalContent={<>
                <a
                  href={codeMeta?.urlRepo}
                  target="blank"
                  className="underline"
                >
                  Sync your fork
                </a>
                {' '}
                to receive the latest fixes and features
              </>}
            />}
          <ScoreCardRow
            icon={<BiLogoGithub size={17} />}
            content={<div
              className="flex flex-wrap gap-x-4 gap-y-1 overflow-auto"
            >
              <div className="flex items-center gap-1 *:whitespace-nowrap">
                <a
                  href={codeMeta?.urlOwner}
                  target="blank"
                >
                  {codeMeta?.owner ?? TEMPLATE_REPO_OWNER}
                </a>
                <div>/</div>
                <a
                  href={codeMeta?.urlRepo}
                  target="blank"
                >
                  {codeMeta?.repo ?? TEMPLATE_REPO_NAME}
                </a>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <div><BiGitBranch size={17} /></div>
                <a
                  className="truncate"
                  href={codeMeta?.urlBranch}
                  target="blank"
                >
                  {codeMeta?.branch ?? TEMPLATE_REPO_BRANCH}
                </a>
              </div>
            </div>}
          />
          <ScoreCardRow
            icon={<BiGitCommit size={18} className="translate-y-[0px]" />}
            content={<a
              href={codeMeta?.urlCommit}
              target="blank"
              className="flex items-center gap-2"
            >
              <span className="text-medium">
                {VERCEL_GIT_COMMIT_SHA_SHORT ?? DEBUG_COMMIT_SHA}
              </span>
              <span className="truncate">
                {VERCEL_GIT_COMMIT_MESSAGE ?? DEBUG_COMMIT_MESSAGE}
              </span>
            </a>}
          />
        </ScoreCard>
      </>}
      <ScoreCard title="Template recommendations">
        {(noAiRateLimiting || debug) && <ScoreCardRow
          icon={<PiWarningBold
            size={17}
            className="translate-x-[0.5px] text-amber-600"
          />}
          content="AI enabled without rate limiting"
          // eslint-disable-next-line max-len
          additionalContent="Create Vercel KV store and link o this project in order to enable rate limiting."
        />}
        {(noAi || debug) && <ScoreCardRow
          icon={<MdLightbulbOutline size={19} />}
          content="Enable AI text generation to improve photo descriptions"
          // eslint-disable-next-line max-len
          additionalContent="Create Vercel KV store and link it to this project in order to enable rate limiting."
        />}
        <ScoreCardRow
          icon={<MdLightbulbOutline size={19} />}
          // eslint-disable-next-line max-len
          content="You seem to have several vertical photos—consider enabling matting to make portrait and landscape photos appear more consistent"
          additionalContent={<>
            Enabled photo matting by setting
            <EnvVar variable="NEXT_PUBLIC_MATTE_PHOTOS" value="1" />
          </>}
        />
        <ScoreCardRow
          icon={<IconGrSync />}
          // eslint-disable-next-line max-len
          content="Consider forking this repository to receive new features and fixes"
        />
        <ScoreCardRow
          icon={<HiSparkles />}
          content="Enable AI text generation in the app configuration"
        />
      </ScoreCard>
      <ScoreCard title="Library Stats">
        <ScoreCardRow
          icon={<HiOutlinePhotograph
            size={17}
            className="translate-y-[0.5px]"
          />}
          content={<>
            {photosCount} photos
            {photosCountHidden > 0 &&
              ` (${photosCountHidden} hidden)`}
          </>}
        />
        <ScoreCardRow
          icon={<FaTag
            size={12}
            className="translate-y-[3px]"
          />}
          content={`${tagsCount} tags`}
        />
        <ScoreCardRow
          icon={<FaCamera
            size={13}
            className="translate-y-[2px]"
          />}
          content={`${camerasCount} cameras`}
        />
        {filmSimulationsCount &&
          <ScoreCardRow
            icon={<span className="inline-flex w-3">
              <PhotoFilmSimulationIcon
                className="shrink-0 translate-x-[-1px] translate-y-[-0.5px]"
                height={18}
              />
            </span>}
            content={`${filmSimulationsCount} film simulations`}
          />}
        <ScoreCardRow
          icon={<TbCone className="rotate-[270deg] translate-x-[-2px]" />}
          content={`${lensesCount} lenses`}
        />
        <ScoreCardRow
          icon={<FaRegCalendar
            size={13}
            className="translate-y-[1.5px] translate-x-[-2px]"
          />}
          content={descriptionWithSpaces}
        />
      </ScoreCard>
    </div>
  );
}
