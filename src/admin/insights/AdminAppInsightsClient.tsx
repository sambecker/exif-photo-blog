'use client';

import ScoreCard from '@/components/ScoreCard';
import ScoreCardRow from '@/components/ScoreCardRow';
import { dateRangeForPhotos } from '@/photo';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { FaCamera } from 'react-icons/fa';
import { FaTag } from 'react-icons/fa';
import { FaCircleInfo, FaRegCalendar } from 'react-icons/fa6';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { MdAspectRatio } from 'react-icons/md';
import { PiWarningBold } from 'react-icons/pi';
import { TbCone, TbSparkles } from 'react-icons/tb';
import { BiGitBranch, BiGitCommit, BiLogoGithub } from 'react-icons/bi';
import {
  TEMPLATE_REPO_BRANCH,
  TEMPLATE_REPO_OWNER,
  TEMPLATE_REPO_NAME,
  VERCEL_GIT_COMMIT_SHA_SHORT,
  VERCEL_GIT_COMMIT_MESSAGE,
  TEMPLATE_REPO_URL_FORK,
  TEMPLATE_REPO_URL_README,
} from '@/app/config';
import {
  AdminAppInsights,
  getGitHubMetaForCurrentApp,
  hasTemplateRecommendations,
  PhotoStats,
} from '.';
import EnvVar from '@/components/EnvVar';
import { IoSyncCircle } from 'react-icons/io5';
import clsx from 'clsx/lite';
import { PATH_ADMIN_OUTDATED } from '@/app/paths';
import { LiaBroomSolid } from 'react-icons/lia';
import { IoMdGrid } from 'react-icons/io';
import { RiSpeedMiniLine } from 'react-icons/ri';
import AdminLink from '../AdminLink';
import AdminEmptyState from '../AdminEmptyState';
import { pluralize } from '@/utility/string';
import Tooltip from '@/components/Tooltip';
import { useAppState } from '@/state/AppState';
import ScoreCardContainer from '@/components/ScoreCardContainer';

const DEBUG_COMMIT_SHA = '4cd29ed';
const DEBUG_COMMIT_MESSAGE = 'Long commit message for debugging purposes';
const DEBUG_BEHIND_BY = 9;
const DEBUG_PHOTOS_COUNT_OUTDATED = 7;

const WARNING_TEXT_COLOR = 'text-amber-600 dark:text-amber-500';

const readmeAnchor = (anchor: string) =>
  <AdminLink href={`${TEMPLATE_REPO_URL_README}#${anchor}`}>
    README/{anchor}
  </AdminLink>;

const renderLabeledEnvVar = (label: string, envVar: string, value = '1') =>
  <div className="flex flex-col gap-1.5">
    <span className="text-xs uppercase font-medium tracking-wider">
      {label}
    </span>
    <EnvVar variable={envVar} value={value} />
  </div>;

const renderHighlightText = (
  text: string,
  color: 'blue' | 'yellow' = 'blue',
  truncate = true,
) =>
  <span className={clsx(
    'px-1.5 pb-[1px] rounded-md',
    truncate && 'max-w-full inline-block',
    truncate && 'text-ellipsis whitespace-nowrap overflow-x-clip',
    color === 'blue' && 'text-blue-600 bg-blue-100/60',
    color === 'blue' && 'dark:text-blue-400 dark:bg-blue-900/50',
    color === 'yellow' && 'text-amber-700 bg-amber-100/50',
    color === 'yellow' && 'dark:text-amber-400 dark:bg-amber-900/35',
  )}>
    {text}
  </span>;

export default function AdminAppInsightsClient({
  codeMeta,
  insights,
  photoStats: {
    photosCount,
    photosCountHidden,
    photosCountOutdated,
    tagsCount,
    camerasCount,
    filmSimulationsCount,
    focalLengthsCount,
    dateRange,
  },
}: {
  codeMeta?: Awaited<ReturnType<typeof getGitHubMetaForCurrentApp>>
  insights: AdminAppInsights
  photoStats: PhotoStats
}) {
  const { shouldDebugInsights: debug } = useAppState();

  const {
    noFork,
    forkBehind,
    noAi,
    noAiRateLimiting,
    outdatedPhotos,
    photoMatting,
    gridFirst,
    noStaticOptimization,
  } = insights;

  const { descriptionWithSpaces } = dateRangeForPhotos(undefined, dateRange);

  const branchLink = <a
    className="truncate"
    href={codeMeta?.urlBranch}
    target="blank"
  >
    {codeMeta?.branch ?? TEMPLATE_REPO_BRANCH}
  </a>;

  return (
    <ScoreCardContainer>
      {(codeMeta || debug) && <>
        <ScoreCard title="Source code">
          {(codeMeta?.didError || debug) &&
            <ScoreCardRow
              icon={<IoSyncCircle
                size={18}
                className={WARNING_TEXT_COLOR}
              />}
              content={<>
                Could not analyze source code
                <Tooltip
                  content="Could not connect to GitHub API. Try refreshing."
                  classNameTrigger="translate-y-[4.5px] ml-2 h-3"
                />
              </>}
            />}
          {((!codeMeta?.didError && noFork) || debug) &&
            <ScoreCardRow
              icon={<FaCircleInfo 
                size={15}
                className="text-blue-500 translate-y-[1px]"
              />}
              content="This template is not forked"
              expandContent={<>
                <AdminLink href={TEMPLATE_REPO_URL_FORK}>
                  Fork original template
                </AdminLink>
                {' '}
                to receive the latest fixes and features.
                {' '}
                Additional instructions in
                {' '}
                {readmeAnchor('receiving-updates')}.
              </>}
            />}
          {((!codeMeta?.didError && forkBehind) || debug) && <ScoreCardRow
            icon={<IoSyncCircle
              size={18}
              className="text-blue-500"
            />}
            content={<>
              This fork is
              {' '}
              {renderHighlightText(
                pluralize(codeMeta?.behindBy ?? DEBUG_BEHIND_BY, 'commit'),
                'blue',
              )}
              {' '}
              behind
            </>}
            expandContent={<>
              <AdminLink href={codeMeta?.urlRepo ?? ''}>
                Sync your fork
              </AdminLink>
              {' '}
              to receive the latest fixes and features.
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
              <div className="hidden sm:flex items-center gap-1 min-w-0">
                <BiGitBranch size={17} />
                {branchLink}
              </div>
            </div>}
          />
          <ScoreCardRow
            className="sm:hidden"
            icon={<BiGitBranch size={17} />}
            content={branchLink}
          />
          <ScoreCardRow
            icon={<BiGitCommit
              size={18}
              className="translate-y-[-0.5px]"
            />}
            content={<a
              href={codeMeta?.urlCommit}
              target="blank"
              className="flex items-center gap-2"
            >
              <span className="text-medium hidden sm:inline-block">
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
        {(hasTemplateRecommendations(insights) || debug)
          ? <>
            {(noAiRateLimiting || debug) && <ScoreCardRow
              icon={<PiWarningBold
                size={17}
                className={clsx(
                  'translate-x-[0.5px]',
                  WARNING_TEXT_COLOR,
                )}
              />}
              content={isExpanded => renderHighlightText(
                'Enable AI rate limiting',
                'yellow',
                !isExpanded,
              )}
              expandContent={<>
                Create Upstash Redis store from storage tab on
                Vercel dashboard and link to this project to
                prevent abuse by enabling rate limiting.
              </>}
            />}
            {(noStaticOptimization || debug) && <ScoreCardRow
              icon={<RiSpeedMiniLine
                size={19}
                className="translate-x-[1px] translate-y-[-1.5px]"
              />}
              content="Speed up page load times"
              expandContent={<>
                Improve load times by enabling static optimization
                {' '}
                on:
                <div className="flex flex-col gap-y-4 mt-3">
                  {renderLabeledEnvVar(
                    'Photo pages',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTOS',
                  )}
                  {renderLabeledEnvVar(
                    'Photo OG images',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_OG_IMAGES',
                  )}
                  {renderLabeledEnvVar(
                    'Category pages (tags, cameras, etc.)',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORIES',
                  )}
                  {renderLabeledEnvVar(
                    'Category OG images',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORY_OG_IMAGES',
                  )}
                  <span>
                    See {readmeAnchor('performance')} for cost implications.
                  </span>
                </div>
              </>}
            />}
            {(noAi || debug) && <ScoreCardRow
              icon={<TbSparkles size={17} />}
              content="Improve SEO + accessibility with AI"
              expandContent={<>
                Enable automatic AI text generation
                {' '}
                by setting <EnvVar variable="OPENAI_SECRET_KEY" />.
                {' '}
                Further instruction and cost considerations in
                {' '}
                {readmeAnchor('ai-text-generation')}.
              </>}
            />}
            {(photoMatting || debug) && <ScoreCardRow
              icon={<MdAspectRatio
                size={17}
                className="rotate-90 translate-x-[-1px]"
              />}
              content="Vertical photos may benefit from matting"
              expandContent={<>
                Enable photo matting to make
                {' '}
                portrait and landscape photos appear more consistent
                {' '}
                <EnvVar variable="NEXT_PUBLIC_MATTE_PHOTOS" value="1" />.
              </>}
            />}
            {(gridFirst || debug) && <ScoreCardRow
              icon={<IoMdGrid size={18} className="translate-y-[-1px]" />}
              content="Grid homepage"
              expandContent={<>
                Now that you have enough photos, consider switching your
                {' '}
                default view to grid by setting
                {' '}
                <EnvVar
                  variable="NEXT_PUBLIC_GRID_HOMEPAGE"
                  value="1"
                  trailingContent="."
                />
              </>}
            />}
          </>
          : <AdminEmptyState includeContainer={false}>
            Nothing to report!
          </AdminEmptyState>}
      </ScoreCard>
      <ScoreCard title="Library Stats">
        {(outdatedPhotos || debug) && <ScoreCardRow
          icon={<LiaBroomSolid
            size={19}
            className={clsx(
              'translate-y-[-2px]',
              WARNING_TEXT_COLOR,
            )}
          />}
          content={renderHighlightText(
            pluralize(
              photosCountOutdated || DEBUG_PHOTOS_COUNT_OUTDATED,
              'outdated photo',
            ),
            'yellow',
          )}
          expandPath={PATH_ADMIN_OUTDATED}
        />}
        <ScoreCardRow
          icon={<HiOutlinePhotograph
            size={17}
            className="translate-y-[0.5px]"
          />}
          content={<>
            {pluralize(photosCount, 'photo')}
            {photosCountHidden > 0 && ` (${photosCountHidden} hidden)`}
          </>}
        />
        <ScoreCardRow
          icon={<FaTag
            size={12}
            className="translate-y-[3px]"
          />}
          content={pluralize(tagsCount, 'tag')}
        />
        <ScoreCardRow
          icon={<FaCamera
            size={13}
            className="translate-y-[2px]"
          />}
          content={pluralize(camerasCount, 'camera')}
        />
        {filmSimulationsCount > 0 &&
          <ScoreCardRow
            icon={<span className="inline-flex w-3">
              <PhotoFilmSimulationIcon
                className="shrink-0 translate-x-[-1px] translate-y-[-0.5px]"
                height={18}
              />
            </span>}
            content={pluralize(filmSimulationsCount, 'film simulation')}
          />}
        <ScoreCardRow
          icon={<TbCone className="rotate-[270deg] translate-x-[-2px]" />}
          content={pluralize(focalLengthsCount, 'focal length')}
        />
        {descriptionWithSpaces && <ScoreCardRow
          icon={<FaRegCalendar
            size={13}
            className="translate-y-[1.5px] translate-x-[-2px]"
          />}
          content={descriptionWithSpaces}
        />}
      </ScoreCard>
    </ScoreCardContainer>
  );
}
