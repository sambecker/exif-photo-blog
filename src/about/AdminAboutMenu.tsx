import MoreMenu from '@/components/more/MoreMenu';
import { PATH_ADMIN_ABOUT_EDIT } from '@/app/path';
import IconEdit from '@/components/icons/IconEdit';

export default function AdminAlbumMenu() {
  return (
    <MoreMenu
      ariaLabel="About menu"
      sections={[{
        items: [{
          label: 'Edit Page',
          icon: <IconEdit size={15} />,
          href: PATH_ADMIN_ABOUT_EDIT,
        }],
      }]}
    />
  );
}
