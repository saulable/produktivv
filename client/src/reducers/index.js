import { combineReducers } from 'redux';
import authReducer from './authReducers';
import flashMessages from './flashMessages';
import taskReducer from './taskReducer';
import notesReducer from './notesReducer';
import calendarReducer from './calendarReducer';
import trackReducer from './trackReducer';

export default combineReducers({
	auth: authReducer,
	tasks: taskReducer,
	notes: notesReducer,
	calendar: calendarReducer,
	tracks: trackReducer,
	flashMessages
});
