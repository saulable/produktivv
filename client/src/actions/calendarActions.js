import axios from 'axios';
import {
	INIT_CAL_TASKS,
	WRITE_QUICK_TASK,
	SWITCH_REPEATS,
	RELOAD_CAL,
	NTH_OCCURENCE,
	REPEAT_QUICK_TASKS
} from './types';
import { dailyRepeatNever, dailyRepeatEnds, dailyRepeatCompletes, weeklyRepeatNever, weeklyRepeatEnds, weeklyRepeatCompletes } from './clientrepeatFunctions';
import jwtDecode from 'jwt-decode';

export const initCal = data => async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	const data = await axios.post('/api/init_cal', user);
	data.data.map((x, index) => {
		x.start = new Date(x.start_date);
		x.end = new Date(x.end_date);
		return x;
	});
	dispatch({ type: INIT_CAL_TASKS, payload: data });
};
export const switchRedueRepeat = data => dispatch => {
	if (data.hasOwnProperty('currentTarget')) {
		data = data.currentTarget.dataset.tag;
	}
	dispatch({ type: SWITCH_REPEATS, payload: data });
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
	const { repeat, timeInterval, activeRepeatRadio } = res.data;
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
			}
		}else if (timeInterval === 'week'){
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
			}
		}
	}
	res.data.start = new Date(res.data.start_date);
	res.data.end = new Date(res.data.end_date);
	dispatch({ type: WRITE_QUICK_TASK, payload: res });
};
export function reloadCal(data) {
	return dispatch => {
		dispatch({ type: RELOAD_CAL, payload: null });
	};
}
