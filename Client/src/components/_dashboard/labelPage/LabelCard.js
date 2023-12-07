import PropTypes from 'prop-types';
// material
import { Card, Typography, Stack } from '@material-ui/core';

// utils
import { fPercent } from '../../../utils/formatNumber';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

LabelsCard.propTypes = {
  label: PropTypes.object
};

export default function LabelsCard({ label }) {
  const { name, confidence, timestamp } = label;

  return (
    <Card
      sx={{
        borderRadius: '0px',
        boxShadow: `inset -20px -20px 60px #f2f2f2,
            inset 20px 20px 60px #ffffff`,
        color: '#3c3c3c',
        backgroundColor: '#F7F7F7',
        '&:hover': {
          backgroundColor: '#F3F3F3'
        }
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography
          variant="title"
          sx={{ color: '#3c3c3c', textAlign: 'center', fontWeight: 700 }}
          noWrap
        >
          {name}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#3c3c3c' }} variant="subtitle1">
            Confidence:
          </Typography>
          <Typography sx={{ color: '#FF1E7E' }}>{fPercent(confidence)}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#3c3c3c' }} variant="subtitle1">
            Timestamp:
          </Typography>
          <Typography sx={{ color: '#FF1E7E' }}>{timestamp}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
