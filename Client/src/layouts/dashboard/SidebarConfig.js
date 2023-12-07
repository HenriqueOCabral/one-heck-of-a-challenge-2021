import { Icon } from '@iconify/react';
import homeOutline from '@iconify/icons-eva/home-outline';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={45} height={45} color="#999999" />;

const sidebarConfig = [
  {
    title: 'Environments',
    path: '/dashboard/app',
    icon: getIcon(homeOutline)
  },
  {
    title: '/LABELS',
    path: '/dashboard/labels'
  },
  {
    title: '/UPLOAD',
    path: '/dashboard/upload'
  }
];

export default sidebarConfig;
