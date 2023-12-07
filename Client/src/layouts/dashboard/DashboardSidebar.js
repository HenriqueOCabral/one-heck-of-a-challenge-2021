import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Drawer } from '@material-ui/core';
// components
import flashOutline from '@iconify/icons-eva/flash-outline';
import settings2Outline from '@iconify/icons-eva/settings-2-outline';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
import logOutOutline from '@iconify/icons-eva/log-out-outline';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';
// ----------------------------------------------------------------------
const getIcon = (name) => <Icon icon={name} width={20} height={20} color="#898898" />;
// ----------------------------------------------------------------------
const DRAWER_WIDTH = 160;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const IconsList = styled('ul')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  list-style: none;

  @media (max-width: 1024px) {
    display: none;
  } ;
`;

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginBottom: 3
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'inline-flex'
          }}
        >
          <Logo
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center'
            }}
          />
        </Box>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box>
        <IconsList>
          <li>{getIcon(flashOutline)}</li>
          <li>{getIcon(settings2Outline)}</li>
          <li>{getIcon(userOutlined)}</li>
          <li>{getIcon(logOutOutline)}</li>
        </IconsList>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
            bgcolor: '#3c3c3c'
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: '#3c3c3c'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
