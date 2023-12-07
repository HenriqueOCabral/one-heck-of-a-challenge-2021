// material
import { Container } from '@material-ui/core';
// components
import Page from '../components/Page';
import { LabelsList, LabelIcon } from '../components/_dashboard/labelPage';
//
import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------

export default function Labels() {
  return (
    <Page title="Upload Your Videos">
      <Container>
        <LabelsList labels={PRODUCTS} />
        <LabelIcon />
      </Container>
    </Page>
  );
}
