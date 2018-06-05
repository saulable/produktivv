import {INIT_CAL_TASKS, WRITE_QUICK_TASK, SWITCH_REPEATS} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
	case INIT_CAL_TASKS:
		return {...state, events: action.payload.data  };
	case WRITE_QUICK_TASK:
		return {...state, taskMessage: action.payload.data};
	case SWITCH_REPEATS:
		return {...state, switchRepeats: action.payload};
	default:
		return state;
	}
};
