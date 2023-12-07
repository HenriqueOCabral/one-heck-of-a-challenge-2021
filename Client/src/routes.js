import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';

//

import DashboardApp from './pages/DashboardApp';
import Labels from './pages/Labels';
import VideoComponent from './pages/Upload';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'labels', element: <Labels /> },
        { path: 'upload', element: <VideoComponent /> }
      ]
    },
    { path: '*', element: <Navigate to="/dashboard" /> }
  ]);
}
