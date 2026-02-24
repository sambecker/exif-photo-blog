import MoreMenu from '@/components/more/MoreMenu';
import { PATH_ADMIN_ABOUT_EDIT } from '@/app/path';
import IconEdit from '@/components/icons/IconEdit';
import IconTrash from '@/components/icons/IconTrash';

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
      }, {
        items: [{
          label: 'Delete Page',
          icon: <IconTrash
            className="translate-x-[-1px]"
          />,
          className: '*:text-error *:hover:text-error *:active:text-error',
          color: 'red',
          href: PATH_ADMIN_ABOUT_EDIT,
        }],
      }]}
    />
  );
}
