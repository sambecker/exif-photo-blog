import { IconBaseProps } from 'react-icons';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';

export default function IconSort({
  sort = 'desc',
  ...props
}: IconBaseProps & { sort?: 'desc' | 'asc' }) {
  return sort === 'desc'
    ? <HiSortDescending size={17} {...props} />
    : <HiSortAscending size={17} {...props} />;
}
