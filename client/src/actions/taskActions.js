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
	UPDATE_TASK_LIST,
	HELPER_POP,
	TASK_OFF_CLICK,
	JOURNAL_AUTOSAVE,
	DELETED_TASK
} from './types';
import { TASK_LI_CLICK } from './types';
import jwtDecode from 'jwt-decode';

export const newTaskRequest = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const pass = { ...data, journal: 'daily', user };
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
	const res = await axios.post('/api/task_retrieve', { id });
	dispatch({ type: TASK_LI_CLICK, payload: res });
};
export function offTaskClick(data) {
	return dispatch => {
		dispatch({ type: TASK_OFF_CLICK, payload: data });
	};
}
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
	case 'dailyj': {
		const res = await axios.post('/api/journal_update', data);
		await dispatch({ type: JOURNAL_AUTOSAVE, payload: res.data });
		break;
	}
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
export function revertAutoSave(data) {
	return dispatch => {
		dispatch({ type: JOURNAL_AUTOSAVE, payload: { success: false } });
	};
}
export function onClickNotes(data) {
	return dispatch => {
		dispatch({ type: UPDATE_TABS, payload: data });
	};
}
export const newOrder = (data) => dispatch => {
	const res = axios.post('/api/update_task_index', {items:data});
	dispatch({ type: UPDATE_TASK_LIST, payload: data });
};
export const clickComplete = data => async dispatch => {
	const id = data.currentTarget.dataset.id;
	const res = await axios.post('/api/complete_task', { id });
	dispatch({ type: COMPLETE_TASK, payload: res });
};
export const deleteTask = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const info = data;
	const res = await axios.post('/api/delete_task', {data, user});
	dispatch({type: DELETED_TASK, payload: res});
};

export const helperPop = data => async dispatch => {
	dispatch({ type: HELPER_POP, payload: data });
};
