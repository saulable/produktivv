const moment = require('moment');

function dailyRepeatNever({ start_date, message, repeatTime }, date) {
	let startLoopDay;
	let endLoopDay;
	if (moment(start_date).isBefore(moment(date))){
		startLoopDay = moment(date).startOf('month');
		endLoopDay = moment(date).endOf('month');
	}else {
		startLoopDay = moment(start_date).startOf('day');
		endLoopDay = moment(start_date).endOf('month');
	}
	let arr = [];
	for (
		let m = startLoopDay;
		m.isBefore(endLoopDay);
		m.add(repeatTime, 'days')
	) {
		// we skip the first day.
		arr.push({
			start_date: m.clone().toDate(),
			end_date: m
				.clone()
				.add(1, 'hours')
				.toDate(),
			message
		});
	}
	return arr;
}
const dailyRepeatEnds = ({ start_date, endsOnDate, message, repeatTime }) => {
	const startLoopDay = moment(start_date).startOf('day');
	const endLoopDay = moment(endsOnDate);
	let arr = [];
	for (
		let m = startLoopDay;
		m.isBefore(endLoopDay);
		m.add(repeatTime, 'days')
	) {
		// we skip the first day.
		arr.push({
			start_date: m.clone().toDate(),
			end_date: m
				.clone()
				.add(1, 'hours')
				.toDate(),
			message
		});
	}
	return arr;
};
const dailyRepeatCompletes = ({
	start_date,
	endsOnDate,
	message,
	repeatTime,
	totalCompletes,
	lastCompleted,
	afterCompletes
}, date) => {
	let startLoopDay;
	// if there are no last completes
	if (lastCompleted === null) {
		startLoopDay = moment(start_date).startOf('day');
	} else {
		// we need to work on the part where we update the completes - or give user option to set?
		startLoopDay = moment(lastCompleted).startOf('day');
	}
	const endLoopDay = moment(startLoopDay).add(
		afterCompletes * repeatTime,
		'days'
	);
	let arr = [];
	for (
		let m = startLoopDay;
		m.isBefore(endLoopDay);
		m.add(repeatTime, 'days')
	) {
		// we skip the first day.
		arr.push({
			start_date: m.clone().toDate(),
			end_date: m
				.clone()
				.add(1, 'hours')
				.toDate(),
			message
		});
	}
	return arr;
};


let dailyArr = (
	init1week,
	m,
	daysSelected,
	message,
	afterCompletes,
	counter
) => {
	// we cycle through 7 days, checking each day if it is inside the daysSelected array.
	let start = m.clone();
	let end = m.clone().add(7, 'days');
	const arr = [];
	// loop through each day between the dates we set in the parent function.
	for (let m = moment(start); m.isBefore(end); m.add(1, 'days')) {
		// if we hit total completes, return the array
		// or if we hit the end of the month, return the array.
		if (counter === afterCompletes) {
			return arr;
		}
		// if the day exists in the array of days selected.
		if (daysSelected.indexOf(m.format('dddd')) !== -1) {
		// skip the first entry
			if (m.toDate().getTime() != init1week[0].start_date.getTime()) {
				arr.push({
					start_date: m.clone().toDate(),
					end_date: m
						.clone()
						.add(1, 'hours')
						.toDate(),
					message
				});
				counter += 1;
				if (m.clone().format('D') === m.clone().endOf('month').format('D')){
					return arr;
				}
			}
		}
	}
	return arr;
};
const weeklyRepeatNever = ({
	start_date,
	end_date,
	message,
	repeatTime,
	daysSelected
}, date) => {
	let startLoopDay;
	let endLoopDay;
	// if the task start_date is before the passed in month, we set the start to loop from start.
	if (moment(start_date).isSame(date, 'month')){
		startLoopDay = moment(start_date);
		endLoopDay = moment(date).endOf('month');
	}else {
		// else we loop from the start of the month.
		startLoopDay = moment(start_date).add(1, 'month');
		endLoopDay = moment(date).endOf('month');
	}
	let arr = [];
	// if there are no days selected, then loop from startday to endloopday adding all the dates.
	for (
		let m = moment(startLoopDay);
		m.isBefore(endLoopDay);
		m.add(repeatTime, 'weeks')
	) {
		arr.push({
			start_date: new Date(m.clone()),
			end_date: new Date(m.clone().add(1, 'hours')),
			message
		});
	}
	return arr;
};

const weeklyRepeatNeverDays = ({
	start_date,
	end_date,
	message,
	repeatTime,
	daysSelected
}, date) => {
	let startLoopDay;
	let endLoopDay;
	if (moment(start_date).isSame(date, 'month')){
		startLoopDay = moment(start_date);
		endLoopDay = moment(date).endOf('month');
	}else {
		// else we loop from the start of the month.
		startLoopDay = moment(date).startOf('month');
		endLoopDay = moment(date).endOf('month');
	}
	// otherwise there are days selected.
	let init1week = [];
	// add the initial date.
	// check that it's the same month. otherwise, get the initial startdate + 1 month
	if (moment(start_date).isSame(date, 'month')){
		init1week.push({
			start_date: moment(startLoopDay).toDate(),
			end_date: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message
		});
	} else {
		init1week.push({
			start_date: moment(startLoopDay).add(1, 'month').toDate(),
			end_date: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message
		});
	}
	// loop through from start of month to end of month, cycling through each day checking if it matches a day in daysSelected, then pushing to the array.
	for (
		let m = moment(startLoopDay);
		m.isBefore(endLoopDay);
		m.add(repeatTime, 'weeks')
	) {
		const val = dailyArr(init1week, m, daysSelected, message, 1);
		init1week.push(...val);
	}
	return init1week;
};

const weeklyRepeatEnds = ({
	start_date,
	end_date,
	endsOnDate,
	message,
	repeatTime,
	daysSelected
}, date) => {
	let startLoopDay;
	let endLoopDay;
	if (moment(start_date).isBefore(moment(date))){
		startLoopDay = moment(date).startOf('month');
		if (moment(endsOnDate).isBefore(moment(date).endOf('month'))){
			endLoopDay = moment(endsOnDate);
		}else {
			endLoopDay = moment(date).endOf('month');
		}
	}else {
		startLoopDay = moment(start_date).startOf('day');
		endLoopDay = moment(start_date).endOf('month');
	}
	// const startLoopDay = moment(start_date).startOf('day');
	// const endLoopDay = moment(start_date).endOf('month');
	let arr = [];
	// if there are no days selected, we just repeat till end of month each week.
	if (daysSelected.length === 0) {
		for (
			let m = moment(startLoopDay);
			m.isBefore(endLoopDay);
			m.add(repeatTime, 'weeks')
		) {
			arr.push({
				start_date: new Date(m.clone()),
				end_date: new Date(m.clone().add(1, 'hours')),
				message
			});
		}
		return arr;
	} else {
		let init1week = [];
		init1week.push({
			start_date: moment(startLoopDay).toDate(),
			end_date: moment(startLoopDay).toDate(),
			message
		});
		for (
			let m = moment(startLoopDay).clone();
			m < endLoopDay;
			m.add(repeatTime, 'weeks')
		) {
			const val = dailyArr(init1week, m, daysSelected, message, 1);
			init1week.push(...val);
		}
		return init1week;
	}
};

const weeklyRepeatCompletes = ({
	start_date,
	lastCompleted,
	end_date,
	endsOnDate,
	message,
	repeatTime,
	daysSelected,
	afterCompletes
}) => {
	let startLoopDay;
	if (lastCompleted === null) {
		startLoopDay = moment(start_date).startOf('day');
	} else {
		// we need to work on the part where we update the completes - or give user option to set?
		startLoopDay = moment(lastCompleted).startOf('day');
	}
	const endLoopDay = moment(startLoopDay).endOf('month');
	let arr = [];
	// if there are no days selected, we just repeat till end of month each week.
	if (daysSelected.length === 0) {
		for (
			let m = moment(startLoopDay);
			m.isBefore(startLoopDay.endOf('month'));
			m.add(repeatTime, 'weeks')
		) {
			arr.push({
				start_date: new Date(m.clone()),
				end_date: new Date(m.clone().add(1, 'hours')),
				message
			});
		}
		return arr;
	} else {
		let init1week = [];
		init1week.push({
			start_date: moment(startLoopDay).toDate(),
			end_date: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message
		});
		let counter = 1;
		for (
			let m = moment(startLoopDay);
			m.isBefore(endLoopDay);
			m.add(repeatTime, 'weeks')
		) {
			const val = dailyArr(
				init1week,
				m,
				daysSelected,
				message,
				afterCompletes,
				counter
			);
			counter += val.length;
			init1week.push(...val);
		}
		return init1week;
	}
};


const monthlyRepeatNever = ({ start_date, end_date, endsOnDate, message, repeatTime, daysSelected }) => {

};

const monthlyRepeatEnds = ({ start_date, end_date, endsOnDate, message, repeatTime, daysSelected }) => {

};
const monthlyRepeatCompletes = ({ start_date, end_date, endsOnDate, message, repeatTime, daysSelected }) => {

};

module.exports = {
	dailyRepeatNever,
	dailyRepeatEnds,
	dailyRepeatCompletes,
	weeklyRepeatNever,
	weeklyRepeatNeverDays,
	weeklyRepeatEnds,
	weeklyRepeatCompletes,
	monthlyRepeatNever,
	monthlyRepeatEnds,
	monthlyRepeatCompletes
};
