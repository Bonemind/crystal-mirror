import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counterReducer from './counter';
import authReducer from './auth';

export default combineReducers({
   routing: routerReducer,
   auth: authReducer,
   counter: counterReducer
})
