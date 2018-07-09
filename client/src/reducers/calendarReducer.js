import {
	INIT_CAL_TASKS,
	WRITE_QUICK_TASK,
	SWITCH_REPEATS,
	RELOAD_CAL,
	NTH_OCCURENCE,
	REPEAT_QUICK_TASKS,
	SET_TASK_TIMES,
	MONTH_CHOICE
} from '../actions/types';

const initState = {
	events: [],
	monthChoice: 'noDays',
	showBoth: false
};

export default (state = initState, action) => {
	switch (action.type) {
	case INIT_CAL_TASKS:
		return { ...state, events: action.payload.data };
	case SET_TASK_TIMES:
		return {...state, startDate: action.payload.slotStartState, endDate: action.payload.slotEndState};
	case WRITE_QUICK_TASK:
		return {...state, events : [...state.events, action.payload.data]};
	case REPEAT_QUICK_TASKS:{
		const newEvents = [...state.events, ...action.payload];
		return {...state, events: newEvents};
	}
	case MONTH_CHOICE: {
		return {...state, monthChoice: action.payload, showBoth: !state.showBoth};
	}
	case SWITCH_REPEATS:
		return { ...state, switchRepeats: action.payload };
	case RELOAD_CAL:
		return {...state};
	case NTH_OCCURENCE:
		return {...state, nthdayMonth: action.payload};
	default:
		return state;
	}
};
