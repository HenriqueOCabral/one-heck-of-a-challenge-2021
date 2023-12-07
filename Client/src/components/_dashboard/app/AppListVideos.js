import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import playCircleOutlined from '@iconify/icons-ant-design/play-circle-outlined';
// material
import { Box, Stack, Card, Button, Typography, CardHeader } from '@material-ui/core';
import { useVideoContext } from '../../../context/Videos';
// eslint-disable-next-line import/no-named-as-default
import Scrollbar from '../../Scrollbar';

require('dotenv').config();

// ----------------------------------------------------------------------
const arr = [];
// ----------------------------------------------------------------------
//

export default function AppListVideos() {
  // eslint-disable-next-line no-unused-vars
  const { item, setItem } = useVideoContext();
  const [list, setlist] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await fetch(process.env.LAMBDA_LIST_ASSETS, {
      method: 'GET'
    });
    const resultJson = await result.json();
    const assets = resultJson.body;
    await arr.push(assets);
    await setlist(assets);
    setItem(0);
  }, []);

  const renderElements = useMemo(
    () =>
      list.map((element) => (
        <Stack
          key={element.id}
          direction="row"
          alignItems="center"
          spacing={2.5}
          sx={{
            borderLeft: item === element.id ? '5px solid rgb(255, 43, 97)' : 'none',
            background: item === element.id ? 'rgba(255, 43, 97, 0.05)' : 'inherit',
            padding: '10px'
          }}
        >
          <Box
            component="img"
            alt="videoImg"
            src={element.image}
            sx={{ width: 55, height: 55, borderRadius: 0.5 }}
          />
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ wordBreak: 'keep-all' }} noWrap>
              <strong>Id: </strong>
              {element.id}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', wordBreak: 'keep-all' }}
              noWrap
            >
              <strong>Playback_id: </strong> {element.playback}
            </Typography>
          </Box>
          <Button
            variant="caption"
            sx={{
              width: '35px',
              height: '30px',
              margin: 0,
              borderRadius: 0,
              position: 'absolute',
              right: '15px',
              background:
                item === element.id
                  ? `linear-gradient(to right, #212B36, #333333)`
                  : `linear-gradient(to right, rgb(255, 61, 48), rgb(255, 43, 97))`,
              opacity: 0.92
            }}
            onClick={() => {
              setItem(element.id);
            }}
          >
            <Icon icon={playCircleOutlined} color="#F9F9F9" width={25} height={25} />
          </Button>
        </Stack>
      )),
    [item]
  );
  return (
    <Scrollbar sx={{ width: '100%', flexGrow: 1 }}>
      <Card
        sx={{
          borderRadius: '0px',
          backgroundColor: '#F7F7F7',
          padding: 1,
          pr: 2,
          boxShadow: `inset 20px -20px 60px #f2f2f2,
            inset -20px 20px 60px #ffffff`,
          width: '100%',
          flexGrow: 1
        }}
      >
        <CardHeader sx={{ textAlign: 'left' }} title="Video List" />

        <Stack
          spacing={3}
          sx={{
            p: 3.5,
            pr: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            flexGrow: 1
          }}
        >
          {renderElements}
        </Stack>
      </Card>
    </Scrollbar>
  );
}
