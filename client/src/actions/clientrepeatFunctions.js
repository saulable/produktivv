import moment from 'moment';
export function dailyRepeatNever({
	start_date,
	end_date,
	message,
	repeatTime
}) {
	const startLoopDay = moment(start_date).startOf('day');
	const endLoopDay = moment(start_date).endOf('month');
	let arr = [];
	for (
		let m = moment(startLoopDay);
		m.isBefore(endLoopDay);
		m.add(repeatTime, 'days')
	) {
		arr.push({
			start: new Date(m.clone()),
			end: new Date(m.clone().add(1, 'hours')),
			message
		});
	}
	return arr;
}
export function dailyRepeatEnds({
	start_date,
	endsOnDate,
	message,
	repeatTime
}) {
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
			start: new Date(m.clone().toDate()),
			end: new Date(
				m
					.clone()
					.add(1, 'hours')
					.toDate()
			),
			message
		});
	}
	return arr;
}
export function dailyRepeatCompletes({
	start_date,
	endsOnDate,
	message,
	repeatTime,
	totalCompletes,
	lastCompleted,
	afterCompletes
}) {
	let startLoopDay;
	if (lastCompleted === null) {
		startLoopDay = moment(start_date).startOf('day');
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
			start: new Date(m.clone().toDate()),
			end: new Date(
				m
					.clone()
					.add(1, 'hours')
					.toDate()
			),
			message
		});
	}
	return arr;
}

const dailyArr = (
	init1week,
	m,
	daysSelected,
	message,
	afterCompletes,
	counter
) => {
	let start = m.clone();
	let end = m.clone().add(7, 'days');
	const arr = [];
	for (let m = start; m.isBefore(end); m.add(1, 'days')) {
		if (counter === afterCompletes) {
			return arr;
		}
		if (daysSelected.indexOf(m.format('dddd')) !== -1) {
			if (m.toDate().getTime() != init1week[0].start.getTime()) {
				arr.push({
					start: m.clone().toDate(),
					end: m
						.clone()
						.add(1, 'hours')
						.toDate(),
					message
				});
				counter += 1;
			}
		}
	}
	return arr;
};
export const weeklyRepeatNever = ({
	start_date,
	end_date,
	message,
	repeatTime,
	daysSelected
}) => {
	const startLoopDay = moment(start_date).startOf('day');
	const endLoopDay = moment(start_date).endOf('month');
	let arr = [];
	if (daysSelected.length === 0) {
		for (
			let m = moment(startLoopDay);
			m.isBefore(endLoopDay);
			m.add(repeatTime, 'weeks')
		) {
			arr.push({
				start: new Date(m.clone()),
				end: new Date(m.clone().add(1, 'hours')),
				message
			});
		}
		return arr;
	} else {
		let init1week = [];
		init1week.push({
			start: moment(startLoopDay).toDate(),
			end: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message
		});
		for (
			let m = moment(startLoopDay);
			m.isBefore(endLoopDay);
			m.add(repeatTime, 'weeks')
		) {
			const val = dailyArr(init1week, m, daysSelected, message, 1);
			init1week.push(...val);
		}
		return init1week;
	}
};

export const weeklyRepeatEnds = ({
	start_date,
	end_date,
	endsOnDate,
	message,
	repeatTime,
	daysSelected
}) => {
	const startLoopDay = moment(start_date).startOf('day');
	const endLoopDay = moment(start_date).endOf('month');
	let arr = [];
	// if there are no days selected, we just repeat till end of month each week.
	if (daysSelected.length === 0) {
		for (
			let m = moment(startLoopDay);
			m.isBefore(endLoopDay);
			m.add(repeatTime, 'weeks')
		) {
			arr.push({
				start: new Date(m.clone()),
				end: new Date(m.clone().add(1, 'hours')),
				message
			});
		}
		return arr;
	} else {
		let init1week = [];
		init1week.push({
			start: moment(startLoopDay).toDate(),
			end: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message
		});
		for (
			let m = moment(startLoopDay);
			m.isBefore(endsOnDate);
			m.add(repeatTime, 'weeks')
		) {
			const val = dailyArr(init1week, m, daysSelected, message, 1);
			init1week.push(...val);
		}
		return init1week;
	}
};
export const weeklyRepeatCompletes = ({
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
				start: new Date(m.clone()),
				end: new Date(m.clone().add(1, 'hours')),
				message
			});
		}
		return arr;
	} else {
		let init1week = [];
		init1week.push({
			start: moment(startLoopDay).toDate(),
			end: moment(startLoopDay)
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
