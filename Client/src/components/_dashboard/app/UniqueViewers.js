import { Icon } from '@iconify/react';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import faker from 'faker';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: `inset -20px -20px 60px #f2f2f2,
            inset 20px 20px 60px #ffffff;`,
  borderRadius: '0px',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: '#3c3c3c',
  backgroundColor: '#F7F7F7',
  '&:hover': {
    backgroundColor: '#F3F3F3'
  }
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: '#3c3c3c',
  background: `linear-gradient(135deg, ${alpha('#999999', 0)} 0%, ${alpha('#999999', 0.24)} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = faker.datatype.number({ min: 500000, max: 1000000, precision: 1 });

export default function UniqueViewers() {
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={userOutlined} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72, color: 'rgb(255, 43, 97)' }}>
        Unique Viewers
      </Typography>
    </RootStyle>
  );
}
