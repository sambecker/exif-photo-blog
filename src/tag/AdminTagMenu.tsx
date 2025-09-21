import MoreMenu from '@/components/more/MoreMenu';
import { TbFolderUp } from 'react-icons/tb';
import { deleteTagConfirmationText, formatTag } from '.';
import {
  deletePhotoTagGloballyAction,
  upgradeTagToAlbumAction,
} from '@/photo/actions';
import { toastSuccess } from '@/toast';
import { pathForAdminAlbumEdit, pathForAdminTagEdit } from '@/app/path';
import { usePathname, useRouter } from 'next/navigation';
import { useAppText } from '@/i18n/state/client';
import IconEdit from '@/components/icons/IconEdit';
import IconTrash from '@/components/icons/IconTrash';

export default function AdminTagMenu({
  tag,
  count,
}: {
  tag: string
  count: number
}) {
  const appText = useAppText();
  const path = usePathname();
  const router = useRouter();

  return (
    <MoreMenu
      ariaLabel="Tag menu"
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
          href: pathForAdminTagEdit(tag),
        }, {
          icon: <TbFolderUp
            size={16}
            className="translate-x-[-1px]"
          />,
          label: 'Upgrade',
          action: () => {
            // eslint-disable-next-line max-len
            if (confirm(`Are you sure you want to upgrade "${formatTag(tag)}" to an album?`)) {
              return upgradeTagToAlbumAction(tag)
                .then(() => {
                  toastSuccess(`"${formatTag(tag)}" upgraded to album`);
                  router.push(pathForAdminAlbumEdit(tag));
                });
            }
          },
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
            if (confirm(deleteTagConfirmationText(tag, count, appText))) {
              return deletePhotoTagGloballyAction(tag, path);
            }
          },
        }],
      }]}
    />
  );
}
