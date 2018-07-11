import {
	INIT_CAL_TASKS,
	WRITE_QUICK_TASK,
	SWITCH_REPEATS,
	RELOAD_CAL,
	NTH_OCCURENCE,
	REPEAT_QUICK_TASKS,
	SET_TASK_TIMES,
	MONTH_CHOICE,
	CHANGE_EVERY_TIME,
	HANDLE_REPEAT_DROPDOWN,
	REPEAT_EVERY_CHOICE,
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
	Q_HANDLE_CAL
} from '../actions/types';
import _ from 'lodash';

const initState = {
	events: [],
	monthChoice: 'noDays',
	showBoth: false,
	timeInterval: 'week',
	timePlural: false,
	repeatTime: '1',
	monthlyRepeat: 'noDays',
	monthlyBoth: false,
	repeatDropdown: false,
	redueCompletes: '1',
	redueDays: '1',
	daysSelected: [],
	endsOnDate: '',
	afterCompletes: '',
	activeRepeatRadio: 'never',
	activeRedueRadio: 'never',
	track: '',
	hat: '',
	journal: '',
	note: ''
};

export default (state = initState, action) => {
	switch (action.type) {
	case INIT_CAL_TASKS:
		return { ...state, events: action.payload.data };
	case SET_TASK_TIMES:
		return {
			...state,
			startDate: action.payload.slotStartState,
			endDate: action.payload.slotEndState
		};
	case WRITE_QUICK_TASK:
		return { ...state, events: [...state.events, action.payload.data] };
	case REPEAT_QUICK_TASKS: {
		const newEvents = [...state.events, ...action.payload];
		return { ...state, events: newEvents };
	}
	case MONTH_CHOICE: {
		return {
			...state,
			monthChoice: action.payload,
			showBoth: !state.showBoth
		};
	}
	case SWITCH_REPEATS:
		return { ...state, switchRepeats: action.payload };
	case RELOAD_CAL:
		return { ...state };
	case NTH_OCCURENCE:
		return { ...state, nthdayMonth: action.payload };
	case CHANGE_EVERY_TIME: {
		if (action.payload > 1) {
			if (state.timePlural) {
				return { ...state, repeatTime: action.payload };
			} else {
				return {
					...state,
					repeatTime: action.payload,
					timePlural: true,
					timeInterval: state.timeInterval + 's'
				};
			}
		} else if (state.timePlural) {
			// it's one and timeplural is true, remove the s
			const timeInterval = state.timeInterval.slice(0, -1);
			return {
				...state,
				timeInterval,
				timePlural: false,
				repeatTime: action.payload
			};
		} else {
			// else its one and time plural is false
			return { ...state, repeatTime: action.payload.e };
		}
	}
	case HANDLE_REPEAT_DROPDOWN:
		return { ...state, repeatDropdown: !state.repeatDropdown };
	case REPEAT_EVERY_CHOICE: {
		if (state.timePlural) {
			return {
				...state,
				timeInterval: action.payload + 's',
				repeatDropdown: false
			};
		} else {
			return {
				...state,
				timeInterval: action.payload,
				repeatDropdown: false
			};
		}
	}
	case DAY_PICKERS: {
		const day = action.payload.currentTarget.dataset.id;
		const data = state.daysSelected;
		const index = state.daysSelected.indexOf(day);
		if (_.includes(data, day)) {
			const daysSelected = [
				...data.slice(0, index),
				...data.slice(index + 1)
			];
			return { ...state, daysSelected };
		} else {
			const daysSelected = [...state.daysSelected, day];
			return { ...state, daysSelected };
		}
	}
	case HANDLE_COMPLETES:
		return { ...state, afterCompletes: action.payload };
	case REDUE_DAYS_CHANGE:
		return { ...state, redueDays: action.payload };
	case REDUE_COMPLETES:
		return { ...state, redueCompletes: action.payload };
	case TRACKS_CHANGE: {
		const type = action.payload.type;
		return { ...state, track: action.payload.value };
	}
	case HATS_CHANGE:
		return { ...state, hat: action.payload.value };
	case AUTO_JOURNAL:
		return { ...state, journal: action.payload.value };
	case Q_NOTE_CHANGE:
		return { ...state, note: action.payload };
	case Q_TASK_MESSAGE:
		return { ...state, message: action.payload };
	case Q_REPEAT_RADIO: {
		if (action.payload.type === 'repeat') {
			return { ...state, activeRepeatRadio: action.payload.value };
		} else {
			return { ...state, activeRedueRadio: action.payload.value };
		}
	}
	case Q_HANDLE_CAL:
		return { ...state, endsOnDate: action.payload };
	default:
		return state;
	}
};
