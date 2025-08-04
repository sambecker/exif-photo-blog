import IconSort from '@/components/icons/IconSort';
import { BiData, BiHide, BiLockAlt, BiPencil } from 'react-icons/bi';
import { CgDebug } from 'react-icons/cg';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { HiOutlineCog, HiSparkles } from 'react-icons/hi';
import { IoMdGrid } from 'react-icons/io';
import { PiPaintBrushHousehold } from 'react-icons/pi';
import { RiSpeedMiniLine } from 'react-icons/ri';

export interface AdminConfigSection {
  title: string;
  titleShort?: string;
  required?: boolean;
  icon: React.ReactNode;
}

const ADMIN_CONFIG_SECTIONS = [{
  title: 'Storage',
  required: true,
  icon: <BiData size={16} className="translate-y-[1px]" />,
}, {
  title: 'Authentication',
  required: true,
  icon: <BiLockAlt size={16} />,
}, {
  title: 'Content',
  required: true,
  icon: <BiPencil size={16} />,
}, {
  title: 'AI Content Generation',
  titleShort: 'AI',
  required: false,
  icon: <HiSparkles size={14} />,
}, {
  title: 'Performance',
  required: false,
  icon: <RiSpeedMiniLine size={19} className="translate-y-[1px]" />,
}, {
  title: 'Categories',
  required: false,
  icon: <FaRegFolderClosed size={15} />,
}, {
  title: 'Sorting',
  required: false,
  icon: <IconSort size={18} className="translate-y-[2px]" />,
}, {
  title: 'Display',
  required: false,
  icon: <BiHide size={18} className="translate-y-[1px]" />,
}, {
  title: 'Grid',
  required: false,
  icon: <IoMdGrid size={17} className="translate-y-[1px]" />,
}, {
  title: 'Design',
  required: false,
  icon: <PiPaintBrushHousehold size={19} />,
}, {
  title: 'Settings',
  required: false,
  icon: <HiOutlineCog size={17} className="translate-y-[0.5px]" />,
}, {
  title: 'Internal',
  required: false,
  icon: <CgDebug size={18} className="translate-y-[1px]" />,
}] as const satisfies AdminConfigSection[];

export type ConfigSectionKey = typeof ADMIN_CONFIG_SECTIONS[number]['title'];

export const getAdminConfigSections = (
  areInternalToolsEnabled: boolean,
  simplifiedView?: boolean,
) => ADMIN_CONFIG_SECTIONS.filter(({ title, required }) =>
  (!simplifiedView || required) &&
  (areInternalToolsEnabled || title !== 'Internal'),
);
