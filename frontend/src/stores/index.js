import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counterReducer from './counter';
import authReducer from './auth';
import requestReducer from './requests';
import repositoryReducer from './repositories';

export default combineReducers({
   routing: routerReducer,
   auth: authReducer,
   counter: counterReducer,
   repositories: repositoryReducer,
   requests: requestReducer
})
