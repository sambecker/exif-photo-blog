
import BiDataIcon from '@/components/icons/BiDataIcon';
import LiaKeySolidIcon from '@/components/icons/LiaKeySolidIcon';
import LiaRobotSolidIcon from '@/components/icons/LiaRobotSolidIcon';
import IconAddUpload from '@/components/icons/IconAddUpload';

export const CONFIG_CHECK_SECTIONS = [{
  title: 'Storage',
  required: true,
  icon: <BiDataIcon size={16} className="translate-y-[1px]" />,
}, {
  title: 'Authentication',
  required: true,
  icon: <LiaKeySolidIcon size={16} className="translate-y-[1px]" />,
}, {
  title: 'AI',
  required: false,
  icon: <LiaRobotSolidIcon size={16} className="translate-y-[1px]" />,
}, {
  title: 'Uploads',
  required: false,
  icon: <IconAddUpload size={16} className="translate-y-[1px]" />,
}];

export type AdminConfigSection = typeof CONFIG_CHECK_SECTIONS[number];

export type ConfigSectionKey = typeof CONFIG_CHECK_SECTIONS[number]['title'];

export const getAdminConfigSections = (
  areInternalToolsEnabled: boolean,
  simplifiedView?: boolean,
) => CONFIG_CHECK_SECTIONS.filter(({ title, required }) =>
  (!simplifiedView || required) &&
  (areInternalToolsEnabled || title !== 'Internal'),
);
