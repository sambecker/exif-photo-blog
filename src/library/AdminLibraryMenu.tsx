import MoreMenu from '@/components/more/MoreMenu';
import { PATH_ADMIN_LIBRARY_EDIT } from '@/app/path';
import IconEdit from '@/components/icons/IconEdit';

export default function AdminLibraryMenu() {
  return (
    <MoreMenu
      ariaLabel="Library menu"
      sections={[{
        items: [{
          label: 'Edit Page',
          icon: <IconEdit />,
          href: PATH_ADMIN_LIBRARY_EDIT,
        }],
      }]}
    />
  );
}
