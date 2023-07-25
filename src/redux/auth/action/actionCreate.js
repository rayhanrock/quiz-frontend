import * as actionType from './actionTypes';
import axios from 'axios';
import { handleError } from '../utility';

export const authStart = () => {
  return {
    type: actionType.AUTH_START,
  };
};

export const authSuccess = (token, id, isStuff) => {
  return {
    type: actionType.AUTH_SUCCESS,
    token: token,
    id: id,
    isStuff: isStuff,
  };
};

export const authFailure = (error) => {
  return {
    type: actionType.AUTH_FAILURE,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  return {
    type: actionType.AUTH_LOGOUT,
  };
};

export const checkAuthTimeOut = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));

      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        };
        axios
          .get(
            `${process.env.REACT_APP_API_URL}/api/account/verify-token/`,
            config
          )
          .then((response) => {
            const isStuff = response.data.user.is_staff;
            const id = response.data.user.id;

            dispatch(authSuccess(token, id, isStuff));
          })
          .catch((error) => {
            dispatch(authFailure(error.response.data));
            handleError(error);
          });

        dispatch(
          checkAuthTimeOut((expirationDate - new Date().getTime()) / 1000)
        );
      }
    }
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios.defaults.headers = {
      'Content-Type': 'application/json',
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/account/login/`, {
        username: username,
        password: password,
      })
      .then((response) => {
        const token = response.data.token;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authCheckState());
        dispatch(checkAuthTimeOut(3600));
      })
      .catch((error) => {
        console.log('authlogin', error);
        dispatch(
          authFailure(error.response.data ? error.response.data : error)
        );
        handleError(error);
      });
  };
};

export const authSignUp = (username, email, password, confirm_password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios.defaults.headers = {
      'Content-Type': 'application/json',
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/account/users/`, {
        username: username,
        email: email,
        password: password,
        confirm_password: confirm_password,
      })
      .then((response) => {
        dispatch(authLogin(username, password));
      })
      .catch((error) => {
        dispatch(authFailure(error.response.data));
        handleError(error);
      });
  };
};
