import { parseISO, parse, format, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Timezone } from './timezone';
import { setDefaultDateFnLocale } from '@/i18n';

setDefaultDateFnLocale();

const DATE_FORMAT_TINY                   = 'dd MMM yy';
const DATE_FORMAT_TINY_PLACEHOLDER       = '00 000 00';

const DATE_FORMAT_SHORT                  = 'dd MMM yyyy';
const DATE_FORMAT_SHORT_PLACEHOLDER      = '00 000 0000';

const DATE_FORMAT_MEDIUM                 = 'dd MMM yy h:mma';
const DATE_FORMAT_MEDIUM_PLACEHOLDER     = '00 000 00 00:0000';

const DATE_FORMAT_LONG                   = 'dd MMM yyyy h:mma';
const DATE_FORMAT_LONG_PLACEHOLDER       = '00 000 0000 00:0000';

const DATE_FORMAT_RSS                    = 'EEE, dd LLL yyyy HH:mm:ss xx';
const DATE_FORMAT_RSS_PLACEHOLDER        = '000, 00 000 0000 00:00:00 00';

export const DATE_FORMAT_POSTGRES               = 'yyyy-MM-dd HH:mm:ss';

export const VALIDATION_EXAMPLE_POSTGRES        = '2025-01-03T21:00:44.000Z';
export const VALIDATION_EXAMPLE_POSTGRES_NAIVE  = '2025-01-03 16:00:44';

export const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type AmbiguousTimestamp = number | string;

type Length = 'tiny' | 'short' | 'medium' | 'long' | 'rss';

export const formatDate = ({
  date,
  length = 'long',
  timezone,
  hideTime,
  showPlaceholder,
}: {
  date: Date,
  length?: Length,
  timezone?: Timezone,
  hideTime?: boolean,
  showPlaceholder?: boolean,
}) => {
  let formatString = !hideTime
    ? DATE_FORMAT_LONG
    : DATE_FORMAT_SHORT;
  let placeholderString = !hideTime
    ? DATE_FORMAT_LONG_PLACEHOLDER
    : DATE_FORMAT_SHORT_PLACEHOLDER;

  switch (length) {
    case 'rss':
      formatString = DATE_FORMAT_RSS;
      placeholderString = DATE_FORMAT_RSS_PLACEHOLDER;
      break;
    case 'tiny':
      formatString = DATE_FORMAT_TINY;
      placeholderString = DATE_FORMAT_TINY_PLACEHOLDER;
      break;
    case 'short':
      formatString = DATE_FORMAT_SHORT;
      placeholderString = DATE_FORMAT_SHORT_PLACEHOLDER;
      break;
    case 'medium':
      formatString = !hideTime
        ? DATE_FORMAT_MEDIUM
        : DATE_FORMAT_SHORT;
      placeholderString = !hideTime
        ? DATE_FORMAT_MEDIUM_PLACEHOLDER
        : DATE_FORMAT_SHORT_PLACEHOLDER;
      break;
  }

  return showPlaceholder
    ? placeholderString
    : timezone
      ? formatInTimeZone(date, timezone, formatString)
      : format(date, formatString);
};

export const formatDateFromPostgresString = (
  date: string,
  length?: Length,
) =>
  formatDate({
    date: parse(date, DATE_FORMAT_POSTGRES, new Date()),
    length,
  });

export const formatDateForPostgres = (date: Date) =>
  date.toISOString().replace(
    /(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})/,
    '$1-$2-$3 $4',
  );

const dateFromTimestamp = (timestamp?: AmbiguousTimestamp): Date => {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp * 1000)
    : typeof timestamp === 'string'
      ? /.+Z/i.test(timestamp)
        ? new Date(timestamp)
        : new Date(`${timestamp}Z`)
      : timestamp;
  return isValid(date) ? date as Date : new Date();
};

const createNaiveDateWithOffset = (
  timestamp?: AmbiguousTimestamp,
  offset = '+00:00',
) => {
  const date = dateFromTimestamp(timestamp);
  const dateString = `${date.toISOString()}`.replace(/\.[\d]+Z/, offset);
  return parseISO(dateString);
};

// Run on the server, when there are date/timestamp/offset inputs

export const convertTimestampWithOffsetToPostgresString = (
  timestamp?: AmbiguousTimestamp,
  offset?: string,
) =>
  formatDateForPostgres(createNaiveDateWithOffset(timestamp, offset));

export const convertTimestampToNaivePostgresString = (
  timestamp?: AmbiguousTimestamp,
) =>
  dateFromTimestamp(timestamp)
    .toISOString().replace(
      /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(.[\d]+Z)*/,
      '$1 $2',
    );

// Run in browser to generate local date time strings

export const generateLocalPostgresString = () =>
  formatDateForPostgres(new Date());

export const generateLocalNaivePostgresString = () =>
  format(new Date(), DATE_FORMAT_POSTGRES);

// Form validation to prevent Postgres runtime errors

// POSTGRES: 2025-01-03T21:00:44.000Z
export const validatePostgresDateString = (date = ''): boolean =>
  /^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}(.[\d]+)*Z$/.test(date);

export const validationMessagePostgresDateString = (date = '') =>
  validatePostgresDateString(date)
    ? undefined
    : `Invalid format (${VALIDATION_EXAMPLE_POSTGRES})`;

// NAIVE: 2025-01-03 16:00:44
export const validateNaivePostgresDateString = (date = ''): boolean =>
  /^(\d{4}-\d{2}-\d{2}) \d{2}:\d{2}:\d{2}$/.test(date);

export const validationMessageNaivePostgresDateString = (date = '') =>
  validateNaivePostgresDateString(date)
    ? undefined
    : `Invalid format (${VALIDATION_EXAMPLE_POSTGRES_NAIVE})`;

// Keep "taken at" (UTC) and "taken at (naive)" (local) in sync,
// since sorting uses the former and display uses the latter

const MAX_TIMEZONE_OFFSET_MS = 14 * 60 * 60 * 1000;
const TIMEZONE_OFFSET_STEP_MS = 15 * 60 * 1000;

const naivePostgresStringToUtcMs = (naive: string) =>
  new Date(`${naive.replace(' ', 'T')}Z`).getTime();

const utcMsToNaivePostgresString = (ms: number) =>
  convertTimestampToNaivePostgresString(new Date(ms).toISOString());

// Returns local offset (naive - utc) in ms, if pair is a plausible timezone
export const getTakenAtOffsetMs = (
  takenAt = '',
  takenAtNaive = '',
): number | undefined => {
  if (
    !validatePostgresDateString(takenAt) ||
    !validateNaivePostgresDateString(takenAtNaive)
  ) {
    return undefined;
  }
  // Ignore sub-second precision
  const utcMs = Math.floor(new Date(takenAt).getTime() / 1000) * 1000;
  const offsetMs = naivePostgresStringToUtcMs(takenAtNaive) - utcMs;
  return (
    Math.abs(offsetMs) <= MAX_TIMEZONE_OFFSET_MS &&
    offsetMs % TIMEZONE_OFFSET_STEP_MS === 0
  )
    ? offsetMs
    : undefined;
};

export const convertTakenAtToNaive = (takenAt: string, offsetMs: number) =>
  utcMsToNaivePostgresString(new Date(takenAt).getTime() + offsetMs);

export const convertTakenAtNaiveToUtc = (
  takenAtNaive: string,
  offsetMs: number,
) =>
  new Date(naivePostgresStringToUtcMs(takenAtNaive) - offsetMs)
    .toISOString();

// Short local timezone label, e.g. "EST", "PST", "UTC+5"
export const getLocalTimeZoneLabel = () =>
  new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' })
    .split(' ').at(-1);
