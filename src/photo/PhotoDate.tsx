import ResponsiveDate from '@/components/ResponsiveDate';
import { Photo } from '.';
import { useMemo } from 'react';
import { Timezone } from '@/utility/timezone';
import { useAppText } from '@/i18n/state/client';

export default function PhotoDate({
  photo,
  className,
  dateType = 'takenAt',
  timezone,
  hideTime,
}: {
  photo: Photo
  className?: string
  dateType?: 'takenAt' | 'createdAt' | 'updatedAt'
  timezone: Timezone
  hideTime?: boolean
}) {
  const date = useMemo(() => {
    const date = new Date(dateType === 'takenAt'
      ? photo.takenAtNaive
      : dateType === 'createdAt'
        ? photo.createdAt
        : photo.updatedAt);
    return isNaN(date.getTime()) ? new Date() : date;
  }, [
    dateType,
    photo.takenAtNaive,
    photo.createdAt,
    photo.updatedAt,
  ]);

  const appText = useAppText();

  const getTitleLabel = () => {
    switch (dateType) {
      case 'takenAt':
        return appText.photo.taken;
      case 'createdAt':
        return appText.photo.created;
      case 'updatedAt':
        return appText.photo.updated;
    }
  };

  return (
    <ResponsiveDate {...{
      date,
      className,
      titleLabel: getTitleLabel().toLocaleUpperCase(),
      timezone,
      hideTime,
    }} />
  );
}
