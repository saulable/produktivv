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
	DELETED_TASK,
	UPDATE_DAILY_ID,
	COMPLETE_CAL_TASK
} from './types';
import { TASK_LI_CLICK } from './types';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

export const newTaskRequest = (data, date) => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const pass = { ...data, user, date };
	let res;
	if (moment(date).isSame(moment(), 'day')){
		res = await axios.post('/api/create_task', pass);
	}else {
		res = await axios.post('/api/create_calendar_simpletask', pass);
	}
	await dispatch({ type: CREATE_TASK, payload: res.data });
};

async function initCalTasks(date, user){
	const res = await axios.post('/api/init_cal', {date,user});
	const todayTasks = res.data.filter((x) => {
		if (moment(x.start_date).isSame(moment(date), 'day')){
			return x;
		}else{
			return todayTasks;
		}
	});
	const createDailyTask = await axios.post('/api/create_daily_tasks', {user, date, todayTasks});
	createDailyTask.data.date = createDailyTask.data.forDate;
	return createDailyTask.data;
}
export const dbTasks = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const date = Date.now();
	// check to see if there is a dailytaskList already created
	const resCheckDaily = await axios.post('/api/check_daily_tasks', {date, user});
	if (resCheckDaily.data !== ''){
		if (resCheckDaily.data.taskList.length !== resCheckDaily.data.indexes.length ){
			const dailyTasks = await initCalTasks(date, user);
			dispatch({ type: DAILY_TASK_LIST, payload: dailyTasks});
		}else {
			const taskList = resCheckDaily.data.taskList;
			const _id = resCheckDaily.data._id;
			dispatch({type: DAILY_TASK_LIST, payload: {taskList, _id, date}});
		}
	} else {
		const dailyTasks = await initCalTasks(date, user);
		dispatch({ type: DAILY_TASK_LIST, payload: dailyTasks});
	}
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
export const newOrder = (data, id, date) => async dispatch => {
	// if there is no ID assocated, then we go to create_daily_tasks with the items.
	if (id === undefined){
		const user = jwtDecode(localStorage.getItem('jwtToken'));
		const todayTasks = data;
		dispatch({ type: UPDATE_TASK_LIST, payload: data });
		const res = await axios.post('/api/update_daily_calendar_tasks', {user, date, todayTasks});
		await axios.post('/api/update_task_index', { items: todayTasks, id: res.data._id });
		dispatch({type: UPDATE_DAILY_ID, payload: res.data._id});
	} else {
		axios.post('/api/update_task_index', { items: data, id });
		dispatch({ type: UPDATE_TASK_LIST, payload: data });
	}
};
export const clickComplete = (data, list, curDate) => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const {id, tasktype, start_date, end_date} = data.currentTarget.dataset;
	const date = start_date;
	const todayTasks = list;
	axios.post('/api/complete_task', { id, tasktype, start_date, curDate, end_date});
	axios.post('/api/create_daily_tasks', {user, date, todayTasks});
	dispatch({ type: COMPLETE_TASK, payload: {id} });
};

export const deleteTask = data => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const res = await axios.post('/api/delete_task', { data, user });
	dispatch({ type: DELETED_TASK, payload: res });
};
export const helperPop = data => async dispatch => {
	dispatch({ type: HELPER_POP, payload: data });
};
export const renderTasks = (events, date) => async dispatch => {
	let taskList = [];
	let _id = '';
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const res = await axios.post('/api/check_daily_tasks', {date, user});
	if (res.data !== ''){
		taskList = res.data.taskList;
		_id = res.data._id;
		dispatch({type: DAILY_TASK_LIST, payload: {taskList, _id, date}});
	}else {
		events.map(x => {
			if (x.taskType === 'simplelong' && moment(x.end_date).isSame(moment(date), 'day')){
				taskList.push({start_date: x.start_date,end_date: x.end_date,message: x.message,_id: x._id,completed: x.completed ,taskType: x.taskType});
			}
			if (moment(x.start_date).isSame(moment(date), 'day')) {
				taskList.push({start_date: x.start_date,end_date: x.end_date,message: x.message,_id: x._id,completed: x.completed,taskType: x.taskType,
				});
			}
			return events;
		});
		dispatch({type: DAILY_TASK_LIST, payload: {taskList, date}});
	}
};
