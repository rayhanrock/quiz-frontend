import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import authReducer from '../auth/reducers/reducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  auth: authReducer,
});

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));
export default store;
