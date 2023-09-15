import { format, parseISO, parse } from 'date-fns';

const DATE_STRING_FORMAT_SHORT    = 'dd MMM yyyy';
const DATE_STRING_FORMAT          = 'd MMM yyyy h:mma';
const DATE_STRING_FORMAT_POSTGRES = 'yyyy-MM-dd HH:mm:ss';

export const formatDate = (date: Date, short?: boolean) =>
  format(date, short? DATE_STRING_FORMAT_SHORT : DATE_STRING_FORMAT);

export const formatDateFromPostgresString = (date: string, short?: boolean) =>
  formatDate(parse(date, DATE_STRING_FORMAT_POSTGRES, new Date()), short);

export const formatDateForPostgres = (date: Date) =>
  date.toISOString().replace(
    /(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})/,
    '$1-$2-$3 $4',
  );

const createNaiveDateWithOffset = (
  dateTimestamp = 0,
  offset = '+00:00',
) => {
  const date = new Date(dateTimestamp * 1000);
  const dateString = `${date.toISOString()}`.replace(/\.[\d]+Z/, offset);
  return parseISO(dateString);
};

export const convertTimestampWithOffsetToPostgresString = (
  dateTimestamp?: number,
  offset?: string,
) => formatDateForPostgres(
  createNaiveDateWithOffset(dateTimestamp, offset)
);

export const convertTimestampToNaivePostgresString = (timestamp = 0) =>
  new Date(timestamp * 1000).toISOString().replace(
    /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(.[\d]+Z)*/,
    '$1 $2',
  );
