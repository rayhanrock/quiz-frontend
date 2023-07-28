import React from 'react';
import Nav from '../components/Nav';
import { Grid } from 'semantic-ui-react';
import AppContent from '../components/AppContent';

const DefaultLayout = () => {
  return (
    <Grid centered>
      <Grid.Column width={14}>
        <Nav />
        <AppContent />
      </Grid.Column>
    </Grid>
  );
};

export default DefaultLayout;
