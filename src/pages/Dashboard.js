import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
function Dashboard() {
  const [activeItem, setActiveItem] = useState('CreateQuiz');
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  return (
    <Grid
      stackable
      style={{ marginTop: '20px' }}>
      <Grid.Column width={4}>
        <Menu
          fluid
          vertical
          tabular>
          <Menu.Item
            name='Create quiz'
            active={activeItem === 'CreateQuiz'}
            onClick={handleItemClick}
            as={Link}
            to='/dashboard/'
          />
        </Menu>
      </Grid.Column>
      <Grid.Column
        stretched
        width={12}>
        <Outlet />
      </Grid.Column>
    </Grid>
  );
}

export default Dashboard;
