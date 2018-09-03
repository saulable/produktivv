import axios from 'axios';
import {
	INIT_CAL_TASKS,
	CALENDAR_VIEW,
	COMPLETE_CAL_TASK,
	DELETE_CAL_TASK,
	EDIT_CAL_TASK,
	UPDATE_CAL_TASK_MESSAGE,
	WRITE_QUICK_TASK,
	SWITCH_REPEATS,
	RELOAD_CAL,
	NTH_OCCURENCE,
	REPEAT_QUICK_TASKS,
	SET_TASK_TIMES,
	MONTH_CHOICE,
	CHANGE_EVERY_TIME,
	HANDLE_REPEAT_DROPDOWN,
	HANDLE_REDUE_DROPDOWN,
	REPEAT_EVERY_CHOICE,
	REDUE_EVERY_CHOICE,
	DAY_PICKERS,
	HANDLE_COMPLETES,
	REDUE_DAYS_CHANGE,
	REDUE_COMPLETES,
	TRACKS_CHANGE,
	HATS_CHANGE,
	AUTO_JOURNAL,
	Q_NOTE_CHANGE,
	Q_TASK_MESSAGE,
	Q_REPEAT_RADIO,
	Q_HANDLE_CAL,
	Q_UPDATE_START_TIME_HOURS,
	Q_UPDATE_START_TIME_MINS,
	Q_UPDATE_END_TIME_HOURS,
	Q_UPDATE_END_TIME_MINS,
	Q_FROM_START,
	Q_TO_END,
	Q_UPDATE_DURATION,
	REPEAT_CATCH_UP,
	GET_TRACKS_AUTOSUGGEST
} from './types';
import {
	dailyRepeatNever,
	dailyRepeatEnds,
	dailyRepeatCompletes,
	weeklyRepeatNever,
	weeklyRepeatEnds,
	weeklyRepeatCompletes
} from './clientrepeatFunctions';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

export const initCal = dataDate => async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	const date = moment(dataDate)
		.clone()
		.toDate();
	const info = { date, user };
	const data = await axios.post('/api/init_cal', info);
	data.data.map((x, index) => {
		x.start = new Date(x.start_date);
		x.end = new Date(x.end_date);
		return x;
	});
	dispatch({ type: INIT_CAL_TASKS, payload: data });
};
export const setCalendarView = data => dispatch => {
	return dispatch ({type: CALENDAR_VIEW, payload: data});
};
export const clickCompleteCal = (data, list, curDate) => async dispatch => {
	const user = jwtDecode(localStorage.getItem('jwtToken'));
	const {id, tasktype, start_date, end_date} = data.currentTarget.dataset;
	axios.post('/api/complete_task', { id, tasktype, start_date, curDate, end_date});
	axios.post('/api/update_daily_calendar_complete_task', {id, start_date, user});
	dispatch({ type: COMPLETE_CAL_TASK, payload: {id, start_date, tasktype} });
};
export const clickDeleteCal = data => async dispatch => {
	const {id, tasktype, dailyid} = data.currentTarget.dataset;
	const dailyId = dailyid;
	const _id = id;
	switch (tasktype){
	case 'simple':{
		axios.post('/api/delete_cal_month_task', {dailyId, _id});
		dispatch({type: DELETE_CAL_TASK, payload: {id}});
		break;
	}
	default: break;
	}
};
export const editCalTask = data => async dispatch => {
	const {id, tasktype, dailyid} = data.currentTarget.dataset;
	const res = await axios.post('/api/edit_cal_task', {id, tasktype, dailyid});
	return dispatch({ type: EDIT_CAL_TASK, payload: res.data});
};
export const setTaskMessage = data => async dispatch => {
	return dispatch ({ type: UPDATE_CAL_TASK_MESSAGE, payload: data.message});
};
export const setTimes = data => dispatch => {
	const a = data.slotEndState;
	const b = data.slotStartState;
	const duration = a.diff(b, 'hours');
	dispatch({ type: SET_TASK_TIMES, payload: { data, duration } });
};

export const clickMonth = data => dispatch => {
	const { name } = data.currentTarget.dataset;
	dispatch({ type: MONTH_CHOICE, payload: name });
};

export const switchRedueRepeat = data => dispatch => {
	if (data.hasOwnProperty('currentTarget')) {
		data = data.currentTarget.dataset.tag;
		dispatch({ type: SWITCH_REPEATS, payload: data });
	}else{
		dispatch({ type: SWITCH_REPEATS, payload: null });
	}
};
export function clearRepeats(data) {
	return dispatch => {
		dispatch({ type: SWITCH_REPEATS, payload: null });
	};
}
export const nthOccurenceTask = data => dispatch => {
	dispatch({ type: NTH_OCCURENCE, payload: data });
};

export const quickTaskMessage = data => async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	let res = await axios.post('/api/create_calendar_task', { ...data, user });
	const { repeat, timeInterval, activeRepeatRadio, start_date, end_date } = res.data;
	if (repeat) {
		if (timeInterval === 'day') {
			switch (activeRepeatRadio) {
			case 'never': {
				const newDays = dailyRepeatNever(res.data);
				return dispatch({ type: REPEAT_QUICK_TASKS, payload: newDays });
			}
			case 'on': {
				const newDays = dailyRepeatEnds(res.data);
				return dispatch({ type: REPEAT_QUICK_TASKS, payload: newDays });
			}
			case 'after': {
				const newDays = dailyRepeatCompletes(res.data);
				return dispatch({ type: REPEAT_QUICK_TASKS, payload: newDays });
			}
			default: {
				return;
			}
			}
		} else if (timeInterval === 'week') {
			switch (activeRepeatRadio) {
			case 'never': {
				const newDays = weeklyRepeatNever(res.data);
				return dispatch({ type: REPEAT_QUICK_TASKS, payload: newDays });
			}
			case 'on': {
				const newDays = weeklyRepeatEnds(res.data);
				return dispatch({ type: REPEAT_QUICK_TASKS, payload: newDays });
			}
			case 'after': {
				const newDays = weeklyRepeatCompletes(res.data);
				return dispatch({ type: REPEAT_QUICK_TASKS, payload: newDays });
			}
			default: {
				return;
			}
			}
		}
	}
	res.data.start = new Date(start_date);
	res.data.end = new Date(end_date);
	dispatch({ type: WRITE_QUICK_TASK, payload: res });
};
export function reloadCal(data) {
	return dispatch => {
		dispatch({ type: RELOAD_CAL, payload: null });
	};
}
export function handleMonthTime(e) {
	return dispatch => {
		const { name } = e.currentTarget.dataset;
		dispatch({ type: REPEAT_EVERY_CHOICE, payload: name });
	};
}
export function handleMonthTimeRedue(e) {
	return dispatch => {
		const { name } = e.currentTarget.dataset;
		dispatch({ type: REDUE_EVERY_CHOICE, payload: name });
	};
}
export function changeTime(e) {
	return dispatch => {
		const data = e.target.value;
		dispatch({ type: CHANGE_EVERY_TIME, payload: data });
	};
}
export function handleCompletes(e) {
	return dispatch => {
		dispatch({ type: HANDLE_COMPLETES, payload: e.target.value });
	};
}
export function redueDaysChange(e) {
	return dispatch => {
		dispatch({ type: REDUE_DAYS_CHANGE, payload: e.currentTarget.value });
	};
}
export function handleDayClick(e) {
	return dispatch => {
		dispatch({ type: DAY_PICKERS, payload: e });
	};
}
export function handleRepeatDropdown(e) {
	return dispatch => {
		dispatch({ type: HANDLE_REPEAT_DROPDOWN, payload: e });
	};
}
export function handleRedueDropdown(e) {
	return dispatch => {
		dispatch({ type: HANDLE_REDUE_DROPDOWN, payload: e });
	};
}
export function handleRedueCompletes(e) {
	return dispatch => {
		dispatch({ type: REDUE_COMPLETES, payload: e.target.value });
	};
}
export function handleTracksChange(type, value) {
	return dispatch => {
		dispatch({ type: TRACKS_CHANGE, payload: { type, value } });
	};
}
export function handleHatsChange(type, value) {
	return dispatch => {
		dispatch({ type: HATS_CHANGE, payload: { type, value } });
	};
}
export function handleAutoJournal(type, value) {
	return dispatch => {
		dispatch({ type: AUTO_JOURNAL, payload: { type, value } });
	};
}
export function handleNoteChange(e) {
	return dispatch => {
		dispatch({ type: Q_NOTE_CHANGE, payload: e.target.value });
	};
}
export function taskChange(e) {
	return dispatch => {
		dispatch({ type: Q_TASK_MESSAGE, payload: e.target.value });
	};
}
export function handleRepeatRadio(e) {
	return dispatch => {
		dispatch({
			type: Q_REPEAT_RADIO,
			payload: { type: 'repeat', value: e.currentTarget.dataset.name }
		});
	};
}
export function handleRedueRadio(e) {
	return dispatch => {
		dispatch({
			type: Q_REPEAT_RADIO,
			payload: { type: 'redue', value: e.currentTarget.dataset.name }
		});
	};
}
export function handleCal(e) {
	return dispatch => {
		dispatch({ type: Q_HANDLE_CAL, payload: e });
	};
}
export function handleStartFrom(e) {
	return dispatch => {
		dispatch({ type: Q_FROM_START, payload: e });
	};
}
export function handleEndTo(e) {
	return dispatch => {
		dispatch({ type: Q_TO_END, payload: e });
	};
}
export function startTimePickerHours(data) {
	return dispatch => {
		dispatch({ type: Q_UPDATE_START_TIME_HOURS, payload: data });
	};
}
export function startTimePickerMins(data) {
	return dispatch => {
		dispatch({ type: Q_UPDATE_START_TIME_MINS, payload: data });
	};
}
export function endTimePickerHours(data) {
	return dispatch => {
		dispatch({ type: Q_UPDATE_END_TIME_HOURS, payload: data });
	};
}
export function endTimePickerMins(data) {
	return dispatch => {
		dispatch({ type: Q_UPDATE_END_TIME_MINS, payload: data });
	};
}
export function updateDuration(data) {
	return dispatch => {
		dispatch({ type: Q_UPDATE_DURATION, payload: data });
	};
}
export function catchUp(data){
	return dispatch => {
		dispatch({ type: REPEAT_CATCH_UP, payload: data.currentTarget.dataset.id});
	};
}
export const getTracks = data => async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	const res = await axios.post('/api/tracks/get_track_names', user);
	dispatch({type: GET_TRACKS_AUTOSUGGEST, payload: res});
};
