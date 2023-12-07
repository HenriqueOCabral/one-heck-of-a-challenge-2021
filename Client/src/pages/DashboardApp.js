// material
import { Grid, Container } from '@material-ui/core';
// components
import Page from '../components/Page';
import {
  AppBugReports,
  AppTotalLabels,
  UniqueViewers,
  AppListVideos,
  TotalViews,
  TimelineModerationLabels
} from '../components/_dashboard/app';
import VideoProvider from '../context/Videos';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TotalViews />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <UniqueViewers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppTotalLabels />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid>
          <VideoProvider>
            <Grid item xs={12} md={6} lg={8}>
              <AppListVideos />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <TimelineModerationLabels />
            </Grid>
          </VideoProvider>
        </Grid>
      </Container>
    </Page>
  );
}
