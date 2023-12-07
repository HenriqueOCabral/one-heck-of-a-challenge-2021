import PropTypes from 'prop-types';
// material
import { Grid } from '@material-ui/core';
import LabelsCard from './LabelCard';

// ----------------------------------------------------------------------

LabelsList.propTypes = {
  labels: PropTypes.array.isRequired
};

export default function LabelsList({ labels, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {labels.map((label) => (
        <Grid key={label.id} item xs={12} sm={6} md={3}>
          <LabelsCard label={label} />
        </Grid>
      ))}
    </Grid>
  );
}
