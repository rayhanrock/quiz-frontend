import * as actionTypes from '../action/actionTypes';
import { updateObject } from '../../../utiles/updateObject';

const initState = {
  loading: false,
  token: null,
  id: null,
  isStuff: null,
};

const authStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    token: action.token,
    id: action.id,
    isStuff: action.isStuff,
  });
};

const authFailure = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, initState);
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAILURE:
      return authFailure(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);

    default:
      return state;
  }
};

export default authReducer;
