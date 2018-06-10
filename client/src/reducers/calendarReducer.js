import {
	INIT_CAL_TASKS,
	WRITE_QUICK_TASK,
	SWITCH_REPEATS,
	RELOAD_CAL
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
	case INIT_CAL_TASKS:
		return { ...state, events: action.payload.data };
	case WRITE_QUICK_TASK:
		return {...state, events : [...state.events, action.payload.data]};
	case SWITCH_REPEATS:
		return { ...state, switchRepeats: action.payload };
	case RELOAD_CAL:
		return {...state};
	default:
		return state;
	}
};
