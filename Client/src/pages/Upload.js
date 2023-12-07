// material
import { Grid, Container, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import exportOutlined from '@iconify/icons-ant-design/export-outlined';
// components
import Page from '../components/Page';
import { VideoUpload } from '../components/_dashboard/uploader';

// ----------------------------------------------------------------------
// eslint-disable-next-line
const CardStyle = styled(Grid)(({ theme }) => ({
  boxShadow: `inset 20px 20px 60px #ffffff;`,
  borderRadius: '4px',
  border: '1px solid #99999999',
  width: '100%',
  height: '90px',
  textAlign: 'left',
  padding: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#3c3c3c',
  backgroundColor: '#F7F7F7',
  margin: '35px 5px',
  '&:hover': {
    backgroundColor: '#F3F3F3'
  }
}));

// ----------------------------------------------------------------------

export default function VideoComponent() {
  return (
    <Page title="Moderation Labels">
      <Container>
        <Grid
          sx={{
            p: 3,
            border: '1px dashed #777777',
            boxShadow: `inset -20px -20px 60px #fcfcfc,
            inset 20px 20px 60px #ffffff;`,
            backgroundColor: '#f9f9f9'
          }}
          container
          spacing={3}
        >
          <Typography sx={{ fontSize: '12px', fontWeight: 400, marginBottom: 1 }} type="subtitle">
            GET STARTED
          </Typography>
          <VideoUpload />
          <Typography
            sx={{ fontSize: '12px', fontWeight: 400, my: '20px', marginTop: '45px' }}
            type="subtitle"
          >
            INTEGRATE WITH THE API
          </Typography>
          <CardStyle>
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }} type="title">
              Create an API Access Token
            </Typography>
            <Icon icon={exportOutlined} width={24} height={24} />
          </CardStyle>
          <CardStyle>
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }} type="title">
              Add a video via the API
            </Typography>
            <Icon icon={exportOutlined} width={24} height={24} />
          </CardStyle>
          <CardStyle>
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }} type="title">
              Play it in your own player
            </Typography>
            <Icon icon={exportOutlined} width={24} height={24} />
          </CardStyle>
          <CardStyle>
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }} type="title">
              Monitor and improve experience
            </Typography>
            <Icon icon={exportOutlined} width={24} height={24} />
          </CardStyle>
        </Grid>
      </Container>
    </Page>
  );
}
