import { parseISO, parse, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Timezone } from './timezone';
import { setDefaultDateFnLocale } from '@/i18n';

setDefaultDateFnLocale();

const DATE_STRING_FORMAT_TINY                   = 'dd MMM yy';
const DATE_STRING_FORMAT_TINY_PLACEHOLDER       = '00 000 00';

const DATE_STRING_FORMAT_SHORT                  = 'dd MMM yyyy';
const DATE_STRING_FORMAT_SHORT_PLACEHOLDER      = '00 000 0000';

const DATE_STRING_FORMAT_MEDIUM                 = 'dd MMM yy h:mma';
const DATE_STRING_FORMAT_MEDIUM_PLACEHOLDER     = '00 000 00 00:0000';

const DATE_STRING_FORMAT_LONG                   = 'dd MMM yyyy h:mma';
const DATE_STRING_FORMAT_LONG_PLACEHOLDER       = '00 000 0000 00:0000';

const DATE_STRING_FORMAT_POSTGRES               = 'yyyy-MM-dd HH:mm:ss';

export const VALIDATION_EXAMPLE_POSTGRES        = '2025-01-03T21:00:44.000Z';
export const VALIDATION_EXAMPLE_POSTGRES_NAIVE  = '2025-01-03 16:00:44';

type AmbiguousTimestamp = number | string;

type Length = 'tiny' | 'short' | 'medium' | 'long';

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
    ? DATE_STRING_FORMAT_LONG
    : DATE_STRING_FORMAT_SHORT;
  let placeholderString = !hideTime
    ? DATE_STRING_FORMAT_LONG_PLACEHOLDER
    : DATE_STRING_FORMAT_SHORT_PLACEHOLDER;

  switch (length) {
  case 'tiny':
    formatString = DATE_STRING_FORMAT_TINY;
    placeholderString = DATE_STRING_FORMAT_TINY_PLACEHOLDER;
    break;
  case 'short':
    formatString = DATE_STRING_FORMAT_SHORT;
    placeholderString = DATE_STRING_FORMAT_SHORT_PLACEHOLDER;
    break;
  case 'medium':
    formatString = !hideTime
      ? DATE_STRING_FORMAT_MEDIUM
      : DATE_STRING_FORMAT_SHORT;
    placeholderString = !hideTime
      ? DATE_STRING_FORMAT_MEDIUM_PLACEHOLDER
      : DATE_STRING_FORMAT_SHORT_PLACEHOLDER;
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
    date: parse(date, DATE_STRING_FORMAT_POSTGRES, new Date()),
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
      : undefined;
  return date && !isNaN(date.getTime()) ? date : new Date();
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
  format(new Date(), DATE_STRING_FORMAT_POSTGRES);

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
