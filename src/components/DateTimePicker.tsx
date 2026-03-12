'use client';

import {
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isValid,
} from 'date-fns';
import { clsx } from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import { useFormStatus } from 'react-dom';
import { TbCalendar, TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import {
  DATE_FORMAT_POSTGRES,
  DAY_NAMES,
  getLocalTimeZoneLabel,
} from '@/utility/date';

type DateTimePickerType = 'utc' | 'naive';
type DisplayMode = 'utc' | 'local';

const LOCAL_TZ_LABEL = getLocalTimeZoneLabel() ?? 'LOCAL';

function parseValue(
  value: string,
  type: DateTimePickerType,
  displayMode: DisplayMode,
): Date | null {
  if (!value) return null;
  try {
    if (type === 'utc') {
      const utcDate = new Date(value);
      if (!isValid(utcDate)) return null;
      if (displayMode === 'local') {
        // Return as-is; JS Date local getters will show local time
        return utcDate;
      }
      // Shift UTC components into a local Date so calendar renders UTC time
      return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds(),
      );
    } else {
      const d = parse(value, DATE_FORMAT_POSTGRES, new Date());
      return isValid(d) ? d : null;
    }
  } catch {
    return null;
  }
}

function formatValue(
  displayDate: Date,
  type: DateTimePickerType,
  displayMode: DisplayMode,
): string {
  if (type === 'utc') {
    if (displayMode === 'local') {
      // Local Date components → JS converts to UTC in toISOString()
      return new Date(
        displayDate.getFullYear(),
        displayDate.getMonth(),
        displayDate.getDate(),
        displayDate.getHours(),
        displayDate.getMinutes(),
        displayDate.getSeconds(),
      ).toISOString();
    }
    // UTC mode: treat display components as UTC
    return new Date(Date.UTC(
      displayDate.getFullYear(),
      displayDate.getMonth(),
      displayDate.getDate(),
      displayDate.getHours(),
      displayDate.getMinutes(),
      displayDate.getSeconds(),
    )).toISOString();
  }
  return format(displayDate, DATE_FORMAT_POSTGRES);
}

export default function DateTimePicker({
  value,
  onChange,
  type,
  readOnly,
}: {
  value: string
  onChange?: (value: string) => void
  type: DateTimePickerType
  readOnly?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();
  const isDisabled = readOnly || pending;

  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>('utc');

  const parsedDate = useMemo(
    () => parseValue(value, type, displayMode),
    [value, type, displayMode],
  );

  useClickInsideOutside({
    htmlElements: [containerRef],
    onClickOutside: () => setIsOpen(false),
    shouldListenToClicks: isOpen,
  });

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth));
    const end = endOfWeek(endOfMonth(viewMonth));
    return eachDayOfInterval({ start, end });
  }, [viewMonth]);

  const updateDate = useCallback((newDisplayDate: Date) => {
    onChange?.(formatValue(newDisplayDate, type, displayMode));
  }, [onChange, type, displayMode]);

  const handleDayClick = (day: Date) => {
    const base = parsedDate ?? new Date();
    updateDate(new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      base.getHours(),
      base.getMinutes(),
      base.getSeconds(),
    ));
  };

  const h = parsedDate?.getHours() ?? 0;
  const m = parsedDate?.getMinutes() ?? 0;
  const s = parsedDate?.getSeconds() ?? 0;

  return (
    <div ref={containerRef} className="relative self-start">
      <button
        type="button"
        tabIndex={-1}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;
          if (!isOpen && parsedDate) {
            setViewMonth(parsedDate);
          }
          setIsOpen(o => !o);
        }}
        className="h-9"
      >
        <TbCalendar size={16} />
      </button>
      {isOpen && (
        <div className={clsx(
          'component-surface shadow-lg dark:shadow-xl',
          'absolute right-0 top-full mt-1 z-10',
          'p-3 w-60',
          'animate-fade-in-from-top',
        )}>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="link"
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            >
              <TbChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium">
              {format(viewMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              className="link"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            >
              <TbChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map(day => (
              <div
                key={day}
                className="text-center text-xs text-dim py-0.5"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map(day => {
              const isCurrentMonth = isSameMonth(day, viewMonth);
              const isSelected =
                parsedDate !== null && isSameDay(day, parsedDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={clsx(
                    'link justify-center py-1 px-0! w-full rounded-sm!',
                    !isCurrentMonth && 'text-extra-dim',
                    isCurrentMonth && !isSelected &&
                      'hover:bg-gray-100! dark:hover:bg-gray-800!',
                    isSelected &&
                      // eslint-disable-next-line max-len
                      'bg-gray-900! dark:bg-gray-100! text-white! dark:text-black!',
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Time */}
          <div className={clsx(
            'flex items-center justify-between',
            'mt-2 pt-2 border-t border-gray-200 dark:border-gray-700',
          )}>
            <div className="flex items-center gap-1">
              <TimeField
                value={h}
                max={23}
                onChange={newH => {
                  const base = parsedDate ?? new Date();
                  updateDate(new Date(
                    base.getFullYear(), base.getMonth(), base.getDate(),
                    newH, m, s,
                  ));
                }}
              />
              <span className="text-dim select-none">:</span>
              <TimeField
                value={m}
                max={59}
                onChange={newM => {
                  const base = parsedDate ?? new Date();
                  updateDate(new Date(
                    base.getFullYear(), base.getMonth(), base.getDate(),
                    h, newM, s,
                  ));
                }}
              />
              <span className="text-dim select-none">:</span>
              <TimeField
                value={s}
                max={59}
                onChange={newS => {
                  const base = parsedDate ?? new Date();
                  updateDate(new Date(
                    base.getFullYear(), base.getMonth(), base.getDate(),
                    h, m, newS,
                  ));
                }}
              />
            </div>
            {type === 'utc' && (
              <button
                type="button"
                onClick={() => {
                  const newMode: DisplayMode =
                    displayMode === 'utc' ? 'local' : 'utc';
                  const newParsed = parseValue(value, type, newMode);
                  if (newParsed) setViewMonth(newParsed);
                  setDisplayMode(newMode);
                }}
                className={clsx(
                  'shrink-0 text-xs px-1.5! py-1!',
                  'border font-mono',
                  displayMode === 'local'
                    ? 'border-gray-900 dark:border-gray-100 text-main'
                    : 'border-gray-300 dark:border-gray-600 text-dim',
                )}
              >
                {displayMode === 'local' ? LOCAL_TZ_LABEL : 'UTC'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TimeField({
  value,
  max,
  onChange,
}: {
  value: number
  max: number
  onChange: (value: number) => void
}) {
  const formatted = useMemo(() => String(value).padStart(2, '0'), [value]);
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={draft ?? formatted}
      onChange={e => {
        const val = e.target.value;
        if (!/^\d{0,2}$/.test(val)) return;
        setDraft(val);
        const n = parseInt(val, 10);
        if (!isNaN(n) && n >= 0 && n <= max) {
          onChange(n);
        }
      }}
      onFocus={() => setDraft(formatted)}
      onBlur={() => setDraft(null)}
      className="w-9! min-h-0! text-center px-1! py-1! text-xs"
    />
  );
}
