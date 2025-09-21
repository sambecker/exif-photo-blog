import MoreMenu from '@/components/more/MoreMenu';
import { pathForAdminAlbumEdit } from '@/app/path';
import { usePathname } from 'next/navigation';
import { useAppText } from '@/i18n/state/client';
import IconEdit from '@/components/icons/IconEdit';
import { Album, deleteAlbumConfirmationText } from '.';
import { deleteAlbumAction } from './actions';
import IconTrash from '@/components/icons/IconTrash';

export default function AdminAlbumMenu({
  album,
  count,
}: {
  album: Album
  count: number
}) {
  const appText = useAppText();
  const path = usePathname();

  return (
    <MoreMenu
      ariaLabel="Album menu"
      className="m-3"
      classNameButton="h-3.5 translate-y-1"
      side="bottom"
      sections={[{
        items: [{
          label: 'Edit',
          icon: <IconEdit
            size={15}
            className="translate-y-[0.5px]"
          />,
          href: pathForAdminAlbumEdit(album),
        }],
      }, {
        items: [{
          icon: <IconTrash
            className="translate-x-[-1px]"
          />,
          label: 'Delete',
          className: 'text-error *:hover:text-error',
          color: 'red',
          action: () => {
            if (confirm(deleteAlbumConfirmationText(album, count, appText))) {
              return deleteAlbumAction(album, path);
            }
          },
        }],
      }]}
    />
  );
}
