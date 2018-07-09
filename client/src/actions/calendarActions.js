import axios from 'axios';
import {
	INIT_CAL_TASKS,
	WRITE_QUICK_TASK,
	SWITCH_REPEATS,
	RELOAD_CAL,
	NTH_OCCURENCE,
	REPEAT_QUICK_TASKS,
	SET_TASK_TIMES,
	MONTH_CHOICE
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
import _ from 'lodash';

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
export const setTimes = data => dispatch => {
	dispatch({ type: SET_TASK_TIMES, payload: data });
};

export const clickMonth = data => dispatch => {
	const { name } = data.currentTarget.dataset;
	dispatch({ type: MONTH_CHOICE, payload: name });
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

export function handleMonthTime(e) {
	e.preventDefault();
	const { name } = e.currentTarget.dataset;
	if (this.state.timePlural) {
		this.setState({ timeInterval: name + 's', repeatDropdown: false });
	} else {
		this.setState({ timeInterval: name, repeatDropdown: false });
	}
}

export function changeTime(e) {
	e.preventDefault();
	if (e.target.value > 1) {
		if (this.state.timePlural) {
			this.setState({ repeatTime: e.target.value });
		} else {
			this.setState({
				repeatTime: e.target.value,
				timePlural: true,
				timeInterval: this.state.timeInterval + 's'
			});
		}
	} else if (this.state.timePlural) {
		// it's one and timeplural is true, remove the s
		this.setState({
			timeInterval: this.state.timeInterval.slice(0, -1),
			timePlural: false,
			repeatTime: e.target.value
		});
	} else {
		// else its one and time plural is false
		this.setState({ repeatTime: e.target.value });
	}
}
export function handleCompletes(e) {
	this.setState({ afterCompletes: e.target.value });
}
export function redueDaysChange(e) {
	e.preventDefault();
	this.setState({ redueDays: e.currentTarget.value });
}

export function handleDayClick(e) {
	const day = e.currentTarget.dataset.id;
	const data = this.state.daysSelected;
	const index = this.state.daysSelected.indexOf(day);
	if (_.includes(data, day)) {
		this.setState({
			daysSelected: [...data.slice(0, index), ...data.slice(index + 1)]
		});
	} else {
		this.setState({ daysSelected: [...this.state.daysSelected, day] });
	}
}
export function handleRepeatDropdown(e) {
	this.setState({ repeatDropdown: !this.state.repeatDropdown });
}
export function handleRedueCompletes(e) {
	this.setState({ redueCompletes: e.target.value });
}

export function handleTracksChange(trackId, value) {
	this.setState({ [trackId]: value });
}
export function handleHatsChange(hatId, value) {
	this.setState({ [hatId]: value });
}
export function handleAutoJournal(journalId, value) {
	this.setState({ [journalId]: value });
}
export function handleNoteChange(e) {
	e.preventDefault();
	const { value } = e.target;
	this.setState({ note: value });
}
export function taskChange(e) {
	e.preventDefault();
	const { value } = e.target;
	this.setState({ message: value });
}
export function handleRepeatRadio(e) {
	this.setState({ activeRepeatRadio: e.currentTarget.dataset.name });
}
export function handleCal(e) {
	this.setState({ endsOnDate: e });
}
