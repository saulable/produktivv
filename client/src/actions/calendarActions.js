import axios from 'axios';
import { INIT_CAL_TASKS } from './types';


export function init_cal(data) {
	return async dispatch => {
		await axios.post('/api/init_cal', data);
		dispatch({ type: INIT_CAL_TASKS, payload: data });
	};
}
