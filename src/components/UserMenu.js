// UserMenu.js
import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const UserMenu = () => {
  return (
    <Menu vertical>
      <Menu.Item
        as={NavLink}
        to='/user/info'
        name='userInfo'>
        User Info
      </Menu.Item>
      <Menu.Item
        as={NavLink}
        to='/user/statistics'
        name='userStatistics'>
        User Statistics
      </Menu.Item>
    </Menu>
  );
};

export default UserMenu;
