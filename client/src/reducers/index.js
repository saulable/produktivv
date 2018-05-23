import { combineReducers } from 'redux';
import testReducer from './testReducer';
import authReducer from './authReducers';
import flashMessages from './flashMessages';

export default combineReducers({
	auth: authReducer,
	flashMessages
});
