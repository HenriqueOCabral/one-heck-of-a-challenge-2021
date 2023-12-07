import { Icon } from '@iconify/react';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
// material
import { styled } from '@material-ui/core/styles';
import { Badge } from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: '#3C3C3C',
  borderTopLeftRadius: theme.shape.borderRadiusMd,
  borderBottomLeftRadius: theme.shape.borderRadiusMd,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 }
}));

// ----------------------------------------------------------------------

export default function LabelIcon() {
  return (
    <RootStyle>
      <Badge>
        <Icon icon={alertTriangleOutline} color="#FF4c05" width={24} height={24} />
      </Badge>
    </RootStyle>
  );
}
