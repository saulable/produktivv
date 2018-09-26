import {
	INIT_CAL_TASKS,
	CALENDAR_VIEW,
	DELETE_CAL_TASK,
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
	COMPLETE_CAL_TASK,
	REPEAT_CATCH_UP
} from '../actions/types';
import _ from 'lodash';
import moment from 'moment';

const initState = {
	events: [],
	calendarView: 'BigCalendar',
	showBoth: false,
	timeInterval: 'week',
	timePlural: false,
	repeatTime: '1',
	repeatCarry: 'fixed',
	monthChoice: 'noDays',
	monthlyBoth: false,
	repeatDropdown: false,
	redueDropdown: false,
	redueCompletes: '1',
	daysSelected: [],
	endsOnDate: '',
	afterCompletes: '',
	activeRepeatRadio: 'never',
	activeRedueRadio: 'never',
	switchRepeats: null,
	track: '',
	hat: '',
	journal: '',
	note: '',
	taskDuration: '',
	taskDurationFormat: 'h',
	startTimeHours: '',
	startTimeMinutes: '',
	endTimeHours: '',
	endTimeMinutes: '',
	rptDisabled: false
};

export default (state = initState, action) => {
	switch (action.type) {
	case INIT_CAL_TASKS:
		return { ...state, events: action.payload.data };
	case CALENDAR_VIEW:
		return { ...state, calendarView: action.payload };
	case COMPLETE_CAL_TASK: {
		let index = _.findIndex([...state.events], { _id: action.payload.id });
		if (action.payload.tasktype === 'repeat') {
			const indexRepeat = _.findIndex([...state.events], {
				start_date: action.payload.start_date
			});
			let newArray = state.events.slice();
			const item = state.events[indexRepeat];
			item.completed = !item.completed;
			newArray.splice(indexRepeat, 1, item);
			return { ...state, events: newArray };
		}
		// if there is a match, toggle the state.
		else {
			let index = _.findIndex([...state.events], { _id: action.payload.id });
			const item = state.events[index];
			item.completed = !item.completed;
			let newArray = state.events.slice();
			newArray.splice(index, 1, item);
			return { ...state, events: newArray };
		}
	}
	case DELETE_CAL_TASK: {
		const index = _.findIndex([...state.events], { _id: action.payload.id });
		if (index >= 0) {
			let newArray = state.events.slice();
			newArray.splice(index, 1);
			return { ...state, events: newArray };
		}
		return state;
	}
	case SET_TASK_TIMES: {
		return {
			...state,
			startDate: action.payload.data.slotStartState,
			endDate: action.payload.data.slotEndState,
			taskDuration: action.payload.duration,
			taskDurationFormat: 'h',
			startTimeHours: action.payload.data.slotStartState.format('HH'),
			startTimeMinutes: action.payload.data.slotStartState.format('mm'),
			endTimeHours: action.payload.data.slotEndState.format('HH'),
			endTimeMinutes: action.payload.data.slotEndState.format('mm')
		};
	}
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
		if (action.payload === 'redue') {
			if (state.timePlural) {
				return {
					...state,
					switchRepeats: action.payload,
					timeInterval: 'days'
				};
			} else {
				return {
					...state,
					switchRepeats: action.payload,
					timeInterval: 'day'
				};
			}
		}
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
	case HANDLE_REDUE_DROPDOWN:
		return { ...state, redueDropdown: !state.redueDropdown };
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
	case REDUE_EVERY_CHOICE: {
		if (state.timePlural) {
			return {
				...state,
				timeInterval: action.payload + 's',
				redueDropdown: false
			};
		} else {
			return {
				...state,
				timeInterval: action.payload,
				redueDropdown: false
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
		return { ...state, redueTime: action.payload };
	case REDUE_COMPLETES:
		return { ...state, redueCompletes: action.payload };
	case TRACKS_CHANGE: {
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
	case Q_UPDATE_START_TIME_HOURS: {
		const startDate = moment(state.startDate)
			.set({ h: action.payload })
			.toDate();
		return { ...state, startTimeHours: action.payload, startDate };
	}
	case Q_UPDATE_START_TIME_MINS: {
		const startDate = moment(state.startDate)
			.set({ m: action.payload })
			.toDate();
		return { ...state, startTimeMinutes: action.payload, startDate };
	}
	case Q_UPDATE_END_TIME_HOURS: {
		// const taskDuration = moment(state.startDate).diff(moment(endDate));
		const endDate = moment(state.endDate)
			.set({ h: action.payload })
			.toDate();
		switch (state.taskDurationFormat) {
		case 'h': {
			const duration = moment.duration(
				moment(endDate).diff(moment(state.startDate))
			);
			const taskDuration = Math.round(duration.asHours());
			return {
				...state,
				endTimeHours: action.payload,
				endDate,
				taskDuration
			};
		}
		default: {
			return { ...state, endTimeHours: action.payload, endDate };
		}
		}
	}
	case Q_UPDATE_END_TIME_MINS: {
		const endDate = moment(state.endDate)
			.set({ m: action.payload })
			.toDate();
		return { ...state, endTimeMinutes: action.payload, endDate };
	}
	case Q_FROM_START: {
		const duration = moment.duration(
			moment(state.endDate).diff(moment(action.payload))
		);
		const asDays = duration.asDays();
		const inMonth = moment(action.payload).daysInMonth();
		if (moment(action.payload).isSame(moment(state.endDate), 'day')) {
			return {
				...state,
				startDate: action.payload,
				taskDurationFormat: 'h',
				taskDuration: Math.round(duration.asHours()),
				rptDisabled: false
			};
		} else if (asDays >= 1 && asDays < 7) {
			return {
				...state,
				startDate: action.payload,
				taskDurationFormat: 'd',
				taskDuration: Math.round(asDays),
				rptDisabled: true,
				switchRepeats: null
			};
		} else if (asDays >= 7 && asDays < inMonth) {
			return {
				...state,
				startDate: action.payload,
				taskDurationFormat: 'w',
				taskDuration: Math.round(duration.asWeeks()),
				rptDisabled: true,
				switchRepeats: null
			};
		} else if (asDays >= inMonth) {
			return {
				...state,
				startDate: action.payload,
				taskDurationFormat: 'm',
				taskDuration: Math.round(duration.asMonths()),
				rptDisabled: true,
				switchRepeats: null
			};
		} else {
			return { ...state, startDate: action.payload, taskDuration: 'ERR' };
		}
	}
	case Q_TO_END: {
		const duration = moment.duration(
			moment(action.payload).diff(moment(state.startDate))
		);
		const asDays = duration.asDays();
		const inMonth = moment(state.startDate).daysInMonth();
		if (moment(action.payload).isSame(moment(state.startDate), 'day')) {
			return {
				...state,
				endDate: action.payload,
				taskDurationFormat: 'h',
				taskDuration: Math.round(duration.asHours()),
				rptDisabled: false
			};
		} else if (asDays >= 1 && asDays < 7) {
			return {
				...state,
				endDate: action.payload,
				taskDurationFormat: 'd',
				taskDuration: Math.round(asDays),
				rptDisabled: true,
				switchRepeats: null
			};
		} else if (asDays >= 7 && asDays < inMonth) {
			return {
				...state,
				endDate: action.payload,
				taskDurationFormat: 'w',
				taskDuration: Math.round(duration.asWeeks()),
				rptDisabled: true,
				switchRepeats: null
			};
		} else {
			return {
				...state,
				endDate: action.payload,
				taskDurationFormat: 'm',
				taskDuration: Math.round(duration.asMonths()),
				rptDisabled: true,
				switchRepeats: null
			};
		}
	}
	case Q_UPDATE_DURATION: {
		switch (state.taskDurationFormat) {
		case 'h': {
			const endDate = moment(state.startDate).add(action.payload, 'hours');
			const endTimeHours = endDate.format('HH');
			if (moment(endDate).isBefore(moment(state.startDate).endOf('day'))) {
				return {
					...state,
					taskDuration: action.payload,
					endDate,
					endTimeHours,
					rptDisabled: false
				};
			} else {
				return {
					...state,
					taskDuration: action.payload,
					endDate,
					endTimeHours,
					rptDisabled: true
				};
			}
		}
		case 'd': {
			const endDate = moment(state.startDate).add(action.payload, 'days');
			return {
				...state,
				taskDuration: action.payload,
				endDate
			};
		}
		case 'w': {
			const endDate = moment(state.startDate).add(action.payload, 'weeks');
			return {
				...state,
				taskDuration: action.payload,
				endDate
			};
		}
		case 'm': {
			const endDate = moment(state.startDate).add(action.payload, 'months');
			return {
				...state,
				taskDuration: action.payload,
				endDate
			};
		}
		default: {
			return { ...state };
		}
		}
	}
	case REPEAT_CATCH_UP:
		return { ...state, repeatCarry: action.payload };
	default:
		return state;
	}
};
