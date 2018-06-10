import axios from 'axios';
import { INIT_CAL_TASKS, WRITE_QUICK_TASK, SWITCH_REPEATS, RELOAD_CAL  } from './types';
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
export const switchRepeat = data => dispatch => {
	dispatch({type: SWITCH_REPEATS, payload: data});
};
export function clearRepeats(data) {
	return dispatch => {
		dispatch({type: SWITCH_REPEATS, payload: null});
	};
}
export const quickTaskMessage = data =>  async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	const res = await axios.post('/api/create_calendar_task', {...data, user});
	res.data.start = new Date(res.data.start_date);
	res.data.end = new Date(res.data.end_date);
	dispatch({ type: WRITE_QUICK_TASK, payload: res});
};
export function reloadCal(data){
	return dispatch => {
		dispatch({type: RELOAD_CAL, payload: null});
	};
}
export function handleRadios(data){
	return dispatch => {

	};
}
