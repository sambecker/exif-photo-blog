'use client';

import ScoreCard from '@/components/ScoreCard';
import ScoreCardRow from '@/components/ScoreCardRow';
import { dateRangeForPhotos } from '@/photo';
import { FaCircleInfo, FaRegCalendar } from 'react-icons/fa6';
import { HiMiniArrowsUpDown } from 'react-icons/hi2';
import { MdAspectRatio } from 'react-icons/md';
import { PiWarningBold } from 'react-icons/pi';
import { TbSparkles } from 'react-icons/tb';
import { BiGitBranch, BiGitCommit, BiLogoGithub } from 'react-icons/bi';
import {
  TEMPLATE_REPO_BRANCH,
  TEMPLATE_REPO_OWNER,
  TEMPLATE_REPO_NAME,
  VERCEL_GIT_COMMIT_SHA_SHORT,
  VERCEL_GIT_COMMIT_MESSAGE,
  TEMPLATE_REPO_URL_FORK,
  TEMPLATE_REPO_URL_README,
  CATEGORY_VISIBILITY,
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
import { PATH_ADMIN_PHOTOS_UPDATES } from '@/app/paths';
import { LiaBroomSolid } from 'react-icons/lia';
import { IoMdGrid } from 'react-icons/io';
import { RiSpeedMiniLine } from 'react-icons/ri';
import AdminLink from '../AdminLink';
import AdminEmptyState from '../AdminEmptyState';
import { pluralize } from '@/utility/string';
import Tooltip from '@/components/Tooltip';
import { useAppState } from '@/state/AppState';
import ScoreCardContainer from '@/components/ScoreCardContainer';
import IconLens from '@/components/icons/IconLens';
import IconCamera from '@/components/icons/IconCamera';
import IconRecipe from '@/components/icons/IconRecipe';
import IconFilm from '@/components/icons/IconFilm';
import IconFocalLength from '@/components/icons/IconFocalLength';
import IconTag from '@/components/icons/IconTag';
import IconPhoto from '@/components/icons/IconPhoto';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { ReactNode } from 'react';

const DEBUG_COMMIT_SHA = '4cd29ed';
const DEBUG_COMMIT_MESSAGE = 'Long commit message for debugging purposes';
const DEBUG_BEHIND_BY = 9;
const DEBUG_PHOTOS_NEED_SYNC_COUNT = 7;

const TEXT_COLOR_WARNING  = 'text-amber-600 dark:text-amber-500';
const TEXT_COLOR_BLUE     = 'text-blue-600 dark:text-blue-500';

const readmeAnchor = (anchor: string) =>
  <AdminLink href={`${TEMPLATE_REPO_URL_README}#${anchor}`}>
    README/{anchor}
  </AdminLink>;

const renderLabeledEnvVar = (label: string, envVar: string, value?: string) =>
  <div className="flex flex-col gap-0.5">
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
    photosCountNeedSync,
    camerasCount,
    lensesCount,
    tagsCount,
    recipesCount,
    filmsCount,
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
    noConfiguredDomain,
    noConfiguredMeta,
    photosNeedSync,
    photoMatting,
    camerasFirst,
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

  const renderTooltipContent = (content: ReactNode) =>
    <Tooltip
      content={content}
      classNameTrigger="translate-y-[-1.5px] ml-2 h-3"
      supportMobile
    />;

  return (
    <ScoreCardContainer>
      {(codeMeta || debug) && <>
        <ScoreCard title="Source code">
          {(codeMeta?.didError || debug) &&
            <ScoreCardRow
              icon={<IoSyncCircle
                size={18}
                className={TEXT_COLOR_WARNING}
              />}
              content={<>
                <span>Could not analyze source code</span>
                {renderTooltipContent(
                  'Could not connect to GitHub API. Try refreshing.',
                )}
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
                  TEXT_COLOR_WARNING,
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
            {(noConfiguredDomain || debug) && <ScoreCardRow
              icon={<PiWarningBold
                size={17}
                className={clsx(
                  'translate-x-[0.5px]',
                  TEXT_COLOR_WARNING,
                )}
              />}
              content={isExpanded => renderHighlightText(
                'Configure domain',
                'yellow',
                !isExpanded,
              )}
              expandContent={<>
                Not setting an explicit domain may cause certain features
                to behave unexpectedly. Domains are stored in
                {' '}
                <EnvVar
                  variable="NEXT_PUBLIC_SITE_DOMAIN"
                  trailingContent="."
                />
              </>}
            />}
            {(noConfiguredMeta || debug) && <ScoreCardRow
              icon={<HiOutlineDocumentText
                size={18}
                className="translate-x-[1px] translate-y-[-1px]"
              />}
              content="Configure meta"
              expandContent={<>
                Configure site title (visible in search results and browser tab)
                and site description (visible in search results):
                {' '}
                <div className="flex flex-col gap-y-4 mt-3">
                  {renderLabeledEnvVar(
                    'Site title',
                    'NEXT_PUBLIC_META_TITLE',
                  )}
                  {renderLabeledEnvVar(
                    'Site description',
                    'NEXT_PUBLIC_META_DESCRIPTION',
                  )}
                </div>
              </>}
            />}
            {(noStaticOptimization || debug) && <ScoreCardRow
              icon={<RiSpeedMiniLine
                size={19}
                className="translate-x-[1px] translate-y-[-1.5px]"
              />}
              content="Speed up page load times"
              expandContent={<>
                Improve load times by enabling static optimization:
                <div className="flex flex-col gap-y-4 mt-3">
                  {renderLabeledEnvVar(
                    'Photo pages',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTOS',
                    '1',
                  )}
                  {renderLabeledEnvVar(
                    'Photo OG images',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_OG_IMAGES',
                    '1',
                  )}
                  {renderLabeledEnvVar(
                    'Category pages (tags, cameras, etc.)',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORIES',
                    '1',
                  )}
                  {renderLabeledEnvVar(
                    'Category OG images',
                    'NEXT_PUBLIC_STATICALLY_OPTIMIZE_PHOTO_CATEGORY_OG_IMAGES',
                    '1',
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
                by setting <EnvVar
                  variable="OPENAI_SECRET_KEY"
                  trailingContent="."
                />
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
                <EnvVar
                  variable="NEXT_PUBLIC_MATTE_PHOTOS"
                  value="1"
                  trailingContent="."
                />
              </>}
            />}
            {(camerasFirst || debug) && <ScoreCardRow
              icon={<HiMiniArrowsUpDown
                size={17}
                className="translate-x-[-1px]"
              />}
              content="Move cameras above tags in sidebar"
              expandContent={<>
                Now that you have more than a few tags, consider
                showing cameras first in the sidebar by setting
                {' '}
                <EnvVar
                  variable="NEXT_PUBLIC_CATEGORY_VISIBILITY"
                  value="cameras, tags, recipes, films"
                  trailingContent="."
                />
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
        {(photosNeedSync || debug) && <ScoreCardRow
          icon={<LiaBroomSolid
            size={19}
            className={clsx(
              'translate-y-[-2px]',
              TEXT_COLOR_BLUE,
            )}
          />}
          content={<>
            {renderHighlightText(
              pluralize(
                photosCountNeedSync || DEBUG_PHOTOS_NEED_SYNC_COUNT,
                'photo',
              ),
              'blue',
            )}
            {' '}
            with updates
            {renderTooltipContent(<>
              Missing data or AI&#8209;generated text
            </>)}
          </>}
          expandPath={PATH_ADMIN_PHOTOS_UPDATES}
        />}
        <ScoreCardRow
          icon={<IconPhoto
            size={15}
            className="translate-y-[0.5px]"
          />}
          content={<>
            {pluralize(photosCount, 'photo')}
            {photosCountHidden > 0 && ` (${photosCountHidden} hidden)`}
          </>}
        />
        {CATEGORY_VISIBILITY.map(category => {
          switch (category) {
          case 'cameras':
            return <ScoreCardRow
              key={category}
              icon={<IconCamera
                size={15}
                className="translate-y-[0.5px]"
              />}
              content={pluralize(camerasCount, 'camera')}
            />;
          case 'lenses':
            return <ScoreCardRow
              key={category}
              icon={<IconLens
                size={15}
                className="translate-y-[0.5px]"
              />}
              content={pluralize(lensesCount, 'lens', 'lenses')}
            />;
          case 'tags':
            return <ScoreCardRow
              key={category}
              icon={<IconTag
                size={15}
                className="translate-x-[1px] translate-y-[1px]"
              />}
              content={pluralize(tagsCount, 'tag')}
            />;
          case 'recipes':
            return recipesCount > 0
              ? <ScoreCardRow
                key={category}
                icon={<IconRecipe
                  size={18}
                  className="translate-x-[0.5px] translate-y-[-0.5px]"
                />}
                content={pluralize(recipesCount, 'recipe')}
              />
              : null;
          case 'films':
            return filmsCount > 0
              ? <ScoreCardRow
                key={category}
                icon={<IconFilm size={15} />}
                content={pluralize(filmsCount, 'film')}
              />
              : null;
          case 'focal-lengths':
            return <ScoreCardRow
              key={category}
              icon={<IconFocalLength size={14} />}
              content={pluralize(focalLengthsCount, 'focal length')}
            />;
          }
        })}
        {descriptionWithSpaces && <ScoreCardRow
          icon={<FaRegCalendar
            size={13}
            className="translate-y-[1.5px]"
          />}
          content={descriptionWithSpaces}
        />}
      </ScoreCard>
    </ScoreCardContainer>
  );
}
