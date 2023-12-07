import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import { Icon } from '@iconify/react';


import { Card, Typography, Box, CircularProgress } from '@material-ui/core';
import checkOutilined from '@iconify/icons-ant-design/check-outlined';
import mehOutilined from '@iconify/icons-ant-design/meh-outlined';
import { useState } from 'react';

require('dotenv').config();
// ----------------------------------------------------------------------
export default function VideoUpload() {
  const [sucess, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [loading, setloading] = useState();
  const [close, setclose] = useState(false);

  //

  const onLoading = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: '20%',
        right: '20%',
        zIndex: 99
      }}
    >
      <CircularProgress sx={{ color: '#1CA0FD' }} />
    </Box>
  );

  const onSuccess = () => (
    <Card
      onClick={() => {
        setclose(true);
        setSuccess(false);
      }}
      sx={{
        background: '#F7F7F7',
        border: '1px solid #51e6c4',
        display: close ? 'none' : 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '150px',
        height: '150px',
        position: 'fixed',
        right: '25px',
        cursor: 'pointer'
      }}
    >
      <Typography
        variant="title"
        sx={{ color: '#51e6c4', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}
        noWrap
      >
        <Icon icon={checkOutilined} color="#51e6c4" width={25} height={25} />
        <br />
        Sucess
      </Typography>
    </Card>
  );

  const onFail = () => (
    <Card
      onClick={() => {
        setclose(true);
        setFail(false);
      }}
      sx={{
        background: '#F7F7F7',
        border: '1px solid #EE3E38',
        display: close ? 'none' : 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        width: '150px',
        height: '150px',
        position: 'fixed',
        right: '25px',
        cursor: 'pointer'
      }}
    >
      <Typography
        variant="title"
        sx={{
          color: '#EE3E38',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '14px'
        }}
        noWrap
      >
        <Icon icon={mehOutilined} color="#EE3E38" width={25} height={25} />
        <br />
        Error!
      </Typography>
    </Card>
  );
  //

  const handleChangeStatus = ({ meta, remove }, status) => {
    console.log(status, meta);
  };

  const handleSubmit = async (files, allFiles) => {
    setloading(true);
    const f = files[0];

    // * GET request: presigned URL
    const responseUP = await fetch(process.env.LAMBDA_UPLOAD, { method: 'GET' });
    const upJson = await responseUP.json();
    const asset = upJson.body.map((element) => element.videoUrl).toString();
    // eslint-disable-next-line camelcase
    const video_id = upJson.body.map((element) => element.videoId).toString();

    console.log(video_id);

    setloading(false);
    setSuccess(true);
    allFiles.forEach((f) => f.remove());
  };

  return (
    <>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="video/*"
        inputContent={(files, extra) => (extra.reject ? 'Video Files Only' : 'Add a Video File!')}
        styles={{
          submitButton: {
            background: `linear-gradient(to right, rgb(255, 61, 48), rgb(255, 43, 97))`
          },
          inputLabelWithFiles: {
            color: '#000000'
          },
          dropzone: {
            overflow: 'hidden',
            backgroundColor: '#F9F9F9',
            border: '1px solid #1CA0FD'
          },
          dropzoneActive: {
            overflow: 'hidden',
            backgroundColor: '#F9F9F9',
            border: '1px solid #1CA0FD'
          },
          dropzoneReject: { overflow: 'hidden', borderColor: 'red', backgroundColor: '#DAA' },
          inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : { color: '#3c3c3c' })
        }}
      />
      {sucess ? onSuccess() : <></>}
      {fail ? onFail() : <></>}
      {loading ? onLoading() : <></>}
    </>
  );
}
