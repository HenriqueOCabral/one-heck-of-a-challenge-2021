// material
import { Card, Typography, CardHeader, CardContent } from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot
} from '@material-ui/lab';
// utils
import { styled } from '@material-ui/core/styles';
import { useEffect, useMemo, useState } from 'react';
import { fPercent } from '../../../utils/formatNumber';
import { useVideoContext } from '../../../context/Videos';

require('dotenv').config();
// ---------------------------------------------------------------------
// eslint-disable-next-line
const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: `inset -20px -20px 60px #f2f2f2,
            inset 20px 20px 60px #ffffff;`,
  borderRadius: '0px',
  textAlign: 'center',
  color: '#3c3c3c',
  position: 'sticky',
  backgroundColor: '#F7F7F7',
  '&:hover': {
    backgroundColor: '#F3F3F3'
  }
}));

// ----------------------------------------------------------------------

export default function TimelineModerationLabels() {
  const { item } = useVideoContext();
  const [labels, setlabels] = useState([]);
  const [loading, setloading] = useState(true);
  const [select, setselect] = useState(false);
  const [renderLabels, setrenderLabels] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function getLabels() {
      // console.log({ item });
      const result = await fetch(process.env.LAMBDA_DYNAMODB, {
        method: 'GET'
      });
      setselect(false);
      setloading(true);
      const resultJson = await result.json();
      const findById = resultJson.body;
      const currentFileName = `${item}.mp4`;
      const targetId = await findById.find((video) => video.video_id === currentFileName);
      if (!targetId) {
        setloading(false);
        setselect(true);
        setrenderLabels(false);
        return;
      }
      const id = item;

      const labelObj = targetId.Labels.filter((element) => element.Confidence > 60).map(
        ({ Name, Confidence }, index) => ({
          id,
          labelsName: Name,
          confidence: Confidence,
          key: index
        })
      );
      setlabels(labelObj);
      setloading(false);
      setrenderLabels(true);
    }
    getLabels();
  }, [item]);

  const renderElements = useMemo(
    () =>
      labels.map((item) => (
        <TimelineItem key={item.key}>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                bgcolor: '#FF1E7E'
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="subtitle2" sx={{ color: '#3c3c3c' }}>
              {item.labelsName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#999999' }}>
              Confidence: {fPercent(item.confidence)}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      )),
    [labels]
  );

  const loadingLabel = () => (
    <Card
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Typography variant="title1" sx={{ color: '#3c3c3c', fontSize: '22px' }}>
        Processing Labels...
      </Typography>
      <Typography variant="caption" sx={{ color: '#1CA0FD' }}>
        just a second...
      </Typography>
    </Card>
  );

  const selectLabel = () => (
    <Card
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Typography variant="title1" sx={{ color: '#3c3c3c', fontSize: '22px' }}>
        Select a video to see the results
      </Typography>
      <Typography variant="caption" sx={{ color: '#999999' }}>
        our tool helps you avoid aggressive content.
      </Typography>
    </Card>
  );

  return (
    <RootStyle
      sx={{
        padding: 1,
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader sx={{ textAlign: 'left' }} title="Moderation Labels Timeline" />
      <CardContent>
        <Timeline sx={{ minHeight: '320px' }}>
          {loading ? loadingLabel() : null} {select ? selectLabel() : null}
          {renderLabels ? renderElements : null}
        </Timeline>
      </CardContent>
    </RootStyle>
  );
}
