import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const SideMenuLayout = () => {
  const [activeItem, setActiveItem] = useState('Profile');
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
            name='Profile'
            active={activeItem === 'Profile'}
            onClick={handleItemClick}
            as={Link}
            to='/user/'
          />
          <Menu.Item
            name='Analytics'
            active={activeItem === 'Analytics'}
            onClick={handleItemClick}
            as={Link}
            to='/user/statistics/'
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
};

export default SideMenuLayout;
