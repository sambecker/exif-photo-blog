'use client';

import {
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx/lite';
import { HiSparkles } from 'react-icons/hi';
import { FiArrowDown, FiArrowLeft } from 'react-icons/fi';
import { BiShuffle } from 'react-icons/bi';
import { LuExpand } from 'react-icons/lu';
import AppGrid from '@/components/AppGrid';
import LoaderButton from '@/components/primitives/LoaderButton';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import Spinner from '@/components/Spinner';
import Tooltip from '@/components/Tooltip';
import WarningNote from '@/components/WarningNote';
import EnvVar from '@/components/EnvVar';
import PhotoFolder from '@/components/folder/PhotoFolder';
import { Photo } from '@/photo';
import { pathForPhoto } from '@/app/path';
import { OpenAIModel } from '@/platforms/openai/models';
import {
  AI_MODEL_ANNOTATIONS,
  AI_MODEL_COLUMNS_DEFAULT,
  AI_MODEL_OPTIONS,
  AiModelResult,
} from '.';
import { generateAiTextForModelsAction } from './actions';
import ColorDot from '@/photo/color/ColorDot';
import { Oklch } from '@/photo/color/client';

type LoadingCell = {
  photoId: string
  column: number
}

// Start stacks directly above the row buttons, so pin them to one width
// rather than letting each size to its own icons
const CLASS_BUTTON_SIDEBAR = 'md:ml-4 w-16 justify-center';

// Header and rows are separate grids so the header can stick — a sticky grid
// item can't leave its own row. Sharing this keeps their columns lined up:
// both auto tracks hold an identically sized button, so they resolve alike.
const CLASS_GRID = clsx(
  'grid grid-cols-[1fr_1fr_1fr_auto] items-start gap-x-3',
  // Reclaims the gap-x-3 preceding the collapsed row-button track,
  // so the last model column ends flush with the main grid section
  'md:-mr-3',
);

// Modifier indicates which cells the sparkle will fill. Dimming it separates
// it from the sparkle, which a primary button's own contrast already does.
const renderGenerateIcon = (
  modifier: ReactNode,
  { dim = true }: { dim?: boolean } = {},
) =>
  <span className="flex items-center gap-1">
    <span className={dim ? 'text-dim' : undefined}>{modifier}</span>
    <HiSparkles size={16} />
  </span>;

const renderColorTitleCaption = ({
  color,
  title,
  caption,
  colorTitle,
  footer,
}: {
  color?: Oklch
  title?: string
  caption?: string
  colorTitle?: string
  footer?: ReactNode
}) => {
  if (!(color || title || caption)) {
    return <span className={clsx(
      'flex w-full h-full justify-center items-center',
      'text-dim text-xl',
    )}>
      &mdash;
    </span>;
  }

  return <>
    {color &&
      <div className={clsx(
        (title || caption || footer) && 'mb-1',
      )}>
        <ColorDot
          title={colorTitle}
          className="size-[13px]!"
          color={color}
        />
      </div>}
    {title &&
      <div className="font-bold">
        {title}
      </div>}
    {caption &&
      <div className="text-dim">
        {caption}
      </div>}
    {footer}
  </>;
};

export default function AdminAiModelsClient({
  photos,
  hasOpenAiSecretKey,
}: {
  photos: Photo[]
  hasOpenAiSecretKey: boolean
}) {
  const [columnModels, setColumnModels] =
    useState<OpenAIModel[]>(AI_MODEL_COLUMNS_DEFAULT);

  const [results, setResults] =
    useState<Record<string, AiModelResult[]>>({});
  const [cellsLoading, setCellsLoading] = useState<LoadingCell[]>([]);
  const cellsLoadingRef = useRef<LoadingCell[]>([]);
  const [loadingRowIds, setLoadingRowIds] = useState<string[]>([]);
  const [loadingColumns, setLoadingColumns] = useState<number[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const router = useRouter();
  const [isShuffling, startShuffling] = useTransition();

  const isBusy = cellsLoading.length > 0;

  const isColumnLoading = (column: number) =>
    cellsLoading.some(cell => cell.column === column);

  const isColumnGenerating = (column: number) =>
    loadingColumns.includes(column);

  const isRowGenerating = (photoId: string) =>
    loadingRowIds.includes(photoId);

  const isCellLoading = (photoId: string, column: number) =>
    cellsLoading.some(cell =>
      cell.photoId === photoId && cell.column === column);

  const allColumns = useMemo(() =>
    columnModels.map((_, index) => index)
  , [columnModels]);

  const generate = useCallback(async (
    photoId: string,
    columns: number[],
  ) => {
    // Skip cells another row/column run already has in flight so overlapping
    // clicks can run in parallel without doubling the same request
    const columnsToRun = columns.filter(column =>
      !cellsLoadingRef.current.some(cell =>
        cell.photoId === photoId && cell.column === column));
    if (columnsToRun.length === 0) { return; }

    cellsLoadingRef.current = cellsLoadingRef.current.concat(
      columnsToRun.map(column => ({ photoId, column })),
    );
    setCellsLoading(cellsLoadingRef.current);

    const applyToColumns = (
      current: Record<string, AiModelResult[]>,
      getResult: (column: number, index: number) => AiModelResult,
    ) => {
      const photoResults = [...current[photoId] ?? []];
      columnsToRun.forEach((column, index) => {
        photoResults[column] = getResult(column, index);
      });
      return { ...current, [photoId]: photoResults };
    };

    try {
      const generated = await generateAiTextForModelsAction(
        photoId,
        columnsToRun.map(column => columnModels[column]),
      );
      setResults(current =>
        applyToColumns(current, (_, index) => generated[index]));
    } catch (e: any) {
      setResults(current => applyToColumns(current, column => ({
        model: columnModels[column],
        error: e.message ?? 'Unknown error',
        durationInMs: 0,
      })));
    } finally {
      cellsLoadingRef.current = cellsLoadingRef.current.filter(cell =>
        cell.photoId !== photoId ||
        !columnsToRun.includes(cell.column));
      setCellsLoading(cellsLoadingRef.current);
    }
  }, [columnModels]);

  const generateForPhotos = useCallback(async (
    photosToRun: Photo[],
    columns: number[],
  ) => {
    for (const photo of photosToRun) {
      await generate(photo.id, columns);
    }
  }, [generate]);

  const generateRow = useCallback((photoId: string) => {
    setLoadingRowIds(current => current.concat(photoId));
    void generate(photoId, allColumns).finally(() => {
      setLoadingRowIds(current => current.filter(id => id !== photoId));
    });
  }, [allColumns, generate]);

  const generateColumn = useCallback((column: number) => {
    setLoadingColumns(current => current.concat(column));
    void generateForPhotos(photos, [column]).finally(() => {
      setLoadingColumns(current =>
        current.filter(currentColumn => currentColumn !== column));
    });
  }, [generateForPhotos, photos]);

  const generateAll = useCallback(() => {
    setIsGeneratingAll(true);
    void generateForPhotos(photos, allColumns).finally(() => {
      setIsGeneratingAll(false);
    });
  }, [allColumns, generateForPhotos, photos]);

  const modelOptions = useMemo(() =>
    AI_MODEL_OPTIONS
      .map(model => {
        const annotation = AI_MODEL_ANNOTATIONS[model as string];
        return {
          value: model as string,
          label: annotation
            ? <span>
              {model as string}
              <span className="text-dim">{` (${annotation})`}</span>
            </span>
            : model as string,
        };
      })
  , []);

  const renderColumnHeader = (column: number) =>
    // Keeps an open menu above the photo rows that follow it in the grid
    <div key={column} className="relative z-10 flex gap-2 min-w-0">
      <FieldsetWithStatus
        id={`ai-model-${column}`}
        label={`Model ${column + 1}`}
        hideLabel
        value={columnModels[column] as string}
        onChange={value => setColumnModels(current =>
          current.map((model, index) => index === column ? value : model))}
        selectOptions={modelOptions}
        // Falls back to the raw id so an unlisted model still reads correctly
        selectOptionsDefaultLabel={columnModels[column] as string}
        // Swapping models mid-run would mislabel the results coming back
        readOnly={isColumnLoading(column)}
        className="grow min-w-0 h-full"
      />
      {/* Only this column's own run blocks it, so other columns and
          individual rows can still be started in parallel */}
      <LoaderButton
        icon={renderGenerateIcon(<FiArrowDown size={18} />)}
        onClick={() => generateColumn(column)}
        isLoading={isColumnGenerating(column)}
        disabled={isShuffling || isGeneratingAll}
        tooltip="Generate this column for all photos"
        className="h-full px-2"
      />
    </div>;

  const renderResult = (photoId: string, column: number) => {
    const result = results[photoId]?.[column];

    return <div key={column} className="pl-3.5 h-full">
      {isCellLoading(photoId, column)
        ? <div className="flex w-full h-full justify-center items-center">
          <Spinner />
        </div>
        : result?.error
          ? <span className="text-error">
            {result.error}
          </span>
          : renderColorTitleCaption({
            color: result?.color,
            title: result?.title,
            caption: result?.caption,
            colorTitle: 'AI',
            footer: result && (
              result.title || result.caption || result.color
            )
              ? <div className="flex items-center text-sm text-dim">
                {(result.durationInMs / 1000).toFixed(1)}s
                {/* Names the model that ran, which the column's
                    dropdown may have moved on from since */}
                <Tooltip
                  content={result.model as string}
                  classNameTrigger="ml-1 text-sm -translate-y-px scale-90"
                  supportMobile
                />
              </div>
              : undefined,
          })}
    </div>;
  };

  return (
    <AppGrid
      contentMain={<div className="space-y-4">
        {!hasOpenAiSecretKey &&
          <WarningNote>
            Comparisons address OpenAI directly, which requires
            {' '}
            <EnvVar variable="OPENAI_SECRET_KEY" />
          </WarningNote>}
        <div>
          {/* Background reaches into the sidebar so row buttons scrolling
              past don't appear alongside the Start button */}
          <div className={clsx(
            'sticky top-0 z-20 bg-main py-4 -mt-4',
            'md:-mr-26 md:pr-26',
          )}>
            <div className={CLASS_GRID}>
              {/* Refetches the page, which re-runs its random photo query */}
              <LoaderButton
                icon={<BiShuffle size={18} />}
                onClick={() => startShuffling(() => router.refresh())}
                isLoading={isShuffling}
                disabled={isBusy}
                tooltip="Shuffle photos"
                className="h-full"
              />
              {allColumns.map(renderColumnHeader)}
              <div className="md:w-0">
                <LoaderButton
                  icon={renderGenerateIcon(
                    <LuExpand size={14} className="rotate-45" />,
                    { dim: false },
                  )}
                  onClick={generateAll}
                  isLoading={isGeneratingAll}
                  disabled={isShuffling || isBusy}
                  tooltip="Generate every row"
                  className={CLASS_BUTTON_SIDEBAR}
                  primary
                />
              </div>
            </div>
          </div>
          <div className={clsx(CLASS_GRID, 'gap-y-5')}>
            {photos.map(photo => <Fragment key={photo.id}>
              <div className="flex items-center gap-3 min-w-0">
                <PhotoFolder
                  photos={[photo]}
                  tint="on"
                  href={pathForPhoto({ photo })}
                />
                <div className="min-w-0">
                  {renderColorTitleCaption({
                    color: photo.colorData?.ai,
                    title: photo.title,
                    caption: photo.caption,
                    colorTitle: 'Current',
                  })}
                </div>
              </div>
              {allColumns.map(column => renderResult(photo.id, column))}
              {/* Zero-width once there's a sidebar to overflow into, so the
                  button costs the model columns no width */}
              <div className="md:w-0 h-full flex items-center">
                {/* Only this row's own run blocks it, so other rows and
                    columns can still be started in parallel */}
                <LoaderButton
                  icon={renderGenerateIcon(<FiArrowLeft size={18} />)}
                  onClick={() => generateRow(photo.id)}
                  isLoading={isRowGenerating(photo.id)}
                  disabled={isShuffling || isGeneratingAll}
                  tooltip="Generate this row"
                  className={CLASS_BUTTON_SIDEBAR}
                />
              </div>
            </Fragment>)}
          </div>
        </div>
      </div>}
    />
  );
}
