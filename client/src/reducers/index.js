import { combineReducers } from 'redux';
import testReducer from './testReducer';
import authReducer from './authReducers';

export default combineReducers({
	auth: authReducer
});
