import React, { Suspense, Component } from 'react';
import { Loader } from 'semantic-ui-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actions from './redux/auth/action/actionCreate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./pages/Login'));
const Registration = React.lazy(() => import('./pages/Registration'));

const loading = () => (
  <Loader
    active
    inline='centered'
  />
);

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route
              exact
              path='/registration/'
              name='Registration Page'
              element={<Registration />}
            />

            <Route
              exact
              path='/'
              name='Login Page'
              element={<Login />}
            />
            <Route
              path='*'
              name='Home'
              element={<DefaultLayout />}
            />
          </Routes>

          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Suspense>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username,
    email: state.auth.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
