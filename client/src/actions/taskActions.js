import axios from 'axios';
import { CREATE_TASK } from './types';
import {
	DAILY_TASK_LIST,
	UPDATE_TABS,
	NOTE_WRITE,
	JOURNAL_WRITE,
	JOURNAL_CREATED,
	COMPLETE_TASK,
	UPDATE_TASK_MESSAGE,
	UPDATE_TASK_LIST
} from './types';
import { TASK_LI_CLICK } from './types';
import jwtDecode from 'jwt-decode';

export const newTaskRequest = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const pass = { ...data, journal: 'Daily', user };
	const res = await axios.post('/api/create_task', pass);
	await dispatch({ type: CREATE_TASK, payload: res.data });
};
export const dbTasks = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const res = await axios.post('/api/daily_tasks', user);
	dispatch({ type: DAILY_TASK_LIST, payload: res.data });
};
export const createJournal = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const res = await axios.post('/api/daily_journal', user);
	if (res.data.length > 0) {
		dispatch({ type: JOURNAL_CREATED, payload: res.data });
	}
};
export const taskClick = data => async dispatch => {
	const id = data.currentTarget.dataset.id;
	const res = await axios.post('/api/notes_retrieve', { id });
	dispatch({ type: TASK_LI_CLICK, payload: res });
};
export const handleNoteChange = data => async dispatch => {
	dispatch({ type: NOTE_WRITE, payload: data });
};
export const handleJournalChange = data => async dispatch => {
	dispatch({ type: JOURNAL_WRITE, payload: data });
};
export const handleTaskChange = data => async dispatch => {
	dispatch({ type: UPDATE_TASK_MESSAGE, payload: data });
};
export const saveNoteChange = data => async dispatch => {
	switch (data.name) {
	case 'dailyj':
		await axios.post('/api/journal_update', data);
		break;
	case 'task':
		await axios.post('/api/task_update', data);
		break;
	case 'note':
		axios.post('/api/notes_update', data);
		break;
	default:
		return;
	}
};
export function onClickNotes(data) {
	return dispatch => {
		dispatch({ type: UPDATE_TABS, payload: data });
	};
}
export const newOrder = ({oldIndex, newIndex}) => dispatch => {
	const data = ({oldIndex, newIndex});
	dispatch({type: UPDATE_TASK_LIST, payload: data});
};
export const clickComplete = data => async dispatch => {
	const id = data.currentTarget.dataset.id;
	const res = await axios.post('/api/complete_task', { id });
	dispatch({ type: COMPLETE_TASK, payload: res });
};
