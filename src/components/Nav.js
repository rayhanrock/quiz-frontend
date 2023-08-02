import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/auth/action/actionCreate';

class Nav extends Component {
  state = { activeItem: 'home' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu
          stackable
          pointing
          secondary>
          <Menu.Item
            name='Dashboard'
            active={activeItem === 'dashboard'}
            onClick={this.handleItemClick}
            as={NavLink}
            to='/dashboard/'
          />
          <Menu.Item
            name='Quizzes'
            active={activeItem === 'quizzes'}
            onClick={this.handleItemClick}
            as={NavLink}
            to='/quizzes/'
          />
          <Menu.Item
            name='Profile'
            active={activeItem === 'Profile'}
            onClick={this.handleItemClick}
            as={NavLink}
            to='/user/'
          />
          <Menu.Item
            name='Leaderboard'
            active={activeItem === 'Leaderboard'}
            onClick={this.handleItemClick}
            as={NavLink}
            to='/leaderboard/'
          />

          <Menu.Menu position='right'>
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={this.props.logout}
            />
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Nav);
