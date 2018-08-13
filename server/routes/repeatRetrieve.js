const _ = require('lodash');
const moment = require('moment');
const repeatFunctions = require('./repeatFunctions');

const repeats = (repeatTasks, fullCal, date) => {
	_.map(
		repeatTasks,
		value => {
			const {
				timeInterval,
				activeRepeatRadio,
				daysSelected,
				_id,
				taskDuration
			} = value;
			if (timeInterval === 'day') {
				switch (activeRepeatRadio) {
				case 'never': {
					const repeatDays = repeatFunctions.dailyRepeatNever(value, date);
					return fullCal.push(...repeatDays);
				}
				case 'on': {
					const repeatDays = repeatFunctions.dailyRepeatEnds(value, date);
					return fullCal.push(...repeatDays);
				}
				case 'after': {
					const repeatDays = repeatFunctions.dailyRepeatCompletes(
						value,
						date
					);
					return fullCal.push(...repeatDays);
				}
				}
			} else if (timeInterval === 'week') {
				switch (activeRepeatRadio) {
				case 'never': {
					let repeatDays;
					if (daysSelected.length === 0) {
						repeatDays = repeatFunctions.weeklyRepeatNever(value, date);
					} else {
						repeatDays = repeatFunctions.weeklyRepeatNeverDays(value, date);
					}
					return fullCal.push(...repeatDays);
				}
				case 'on': {
					const repeatDays = repeatFunctions.weeklyRepeatEnds(value, date);
					return fullCal.push(...repeatDays);
				}
				case 'after': {
					const realOccursDate = moment(value.start_date).add(
						value.afterCompletes,
						'weeks'
					);
					if (
						moment(date)
							.startOf('month')
							.isBefore(realOccursDate)
					) {
						const repeatDays = repeatFunctions.weeklyRepeatCompletes(
							value,
							date
						);
						return fullCal.push(...repeatDays);
					}
				}
				}
			} else if (timeInterval === 'month') {
				switch (activeRepeatRadio) {
				case 'never': {
					const repeatDays = repeatFunctions.monthlyRepeatNever(value, date);
					return fullCal.push(...repeatDays);
				}
				case 'on': {
					const repeatDays = repeatFunctions.monthlyRepeatEnds(value, date);
					return fullCal.push(...repeatDays);
				}
				case 'after': {
					const repeatDays = repeatFunctions.monthlyRepeatCompletes(
						value,
						date
					);
					return fullCal.push(...repeatDays);
				}
				}
			} else if (timeInterval === 'year') {
				switch (activeRepeatRadio) {
				case 'never': {
					const repeatDays = repeatFunctions.yearlyRepeatNever(value);
					return fullCal.push(...repeatDays);
				}
				case 'on': {
					const repeatDays = repeatFunctions.yearlyRepeatEnds(value);
					return fullCal.push(...repeatDays);
				}
				case 'after': {
					const repeatDays = repeatFunctions.yearlyRepeatCompletes(value);
					return fullCal.push(...repeatDays);
				}
				}
			}
			fullCal.push(value);
			return fullCal;
		},
		date
	);
};
const redues = (redueTasks, fullCal, date) => {
	redueTasks.filter((x) => {
		if (moment(date).isBetween(moment(x.start_date).startOf('year'), moment(x.end_date).endOf('year'))){
			return x;
		}if (moment(date).isBetween(moment(x.last_completed).startOf('year'), moment(x.last_completed).endOf('year'))){
			return x;
		}
	});
	const allRedueTasks = [];
	redueTasks.map((x) => {
		if (x.lastCompleted === undefined){
			allRedueTasks.push(x);
		}else {
			switch (x.activeRedueRadio) {
			case 'never': {
				let completedDates = [];
				const start_date = moment(x.datesCompleted[x.datesCompleted.length -1]).add(x.repeatTime, x.timeInterval);
				if (moment().isSame(moment(date), 'month') || start_date.isAfter(moment(date).startOf('month'))){
					x.datesCompleted.map((y) => {
						const oldTask =  {start_date: moment(y).toDate(), end_date: moment(y).add(1, 'hours').toDate(), message: x.message, completed: true, taskType:'redue', _id: x._id};
						completedDates.push(oldTask);
					});
				}
				// TODO this needs more work or refinement depending upon user settings.
				if (moment().isSame(date, 'month')){
					if ((start_date.isAfter(moment(date)) || start_date.isSame(moment(date), 'day'))){
						x.start_date = start_date;
						x.end_date = start_date.add(x.taskDuration, 'hours');
					}else if(moment(date).isAfter(start_date)) {
						const start_date = moment(date).set({h: moment(x.start_date).hour(), m: moment(x.start_date).minute()});
						x.start_date = start_date;
						x.overdue = true;
						x.end_date = start_date.add(x.taskDuration, 'hours');
					}
				}else if (start_date.isAfter(moment(date).startOf('month'))){
					x.start_date = start_date;
					x.end_date = start_date.add(x.taskDuration, 'hours');
				}
				completedDates.push(x);
				allRedueTasks.push(...completedDates);
				return;
			}
			case 'on': {
				let completedDates = [];
				const start_date = moment(x.datesCompleted[x.datesCompleted.length -1]).add(x.repeatTime, x.timeInterval);
				if (moment().isSame(moment(date), 'month') || start_date.isAfter(moment(date).startOf('month'))){
					x.datesCompleted.map((y) => {
						const oldTask =  {start_date: moment(y).toDate(), end_date: moment(y).add(1, 'hours').toDate(), message: x.message, completed: true, taskType:'redue', _id: x._id};
						completedDates.push(oldTask);
					});
				}
				const beforeEnds = start_date.isBefore(moment(x.endsOnDate).endOf('day'));
				if (moment().isSame(date, 'month')){
					if (beforeEnds && (start_date.isAfter(moment(date)) || start_date.isSame(moment(date), 'day')) ){
						x.start_date = start_date;
						x.end_date = start_date.add(x.taskDuration, 'hours');
					} else if (beforeEnds && moment(date).isAfter(start_date)){
						const start_date = moment(date).set({h: moment(x.start_date).hour(), m: moment(x.start_date).minute()});
						x.start_date = start_date;
						x.overdue = true;
						x.end_date = start_date.add(x.taskDuration, 'hours');
					}
				}	else if (beforeEnds && start_date.isAfter(moment(date).startOf('month'))){
					x.start_date = start_date;
					x.end_date = start_date.add(x.taskDuration, 'hours');
				}
				completedDates.push(x);
				allRedueTasks.push(...completedDates);
				return;
			}
			case 'after': {
				let completedDates = [];
				const start_date = moment(x.datesCompleted[x.datesCompleted.length -1]).add(x.repeatTime, x.timeInterval);
				if (moment().isSame(moment(date), 'month') || start_date.isAfter(moment(date).startOf('month'))){
					x.datesCompleted.map((y) => {
						const oldTask =  {start_date: moment(y).toDate(), end_date: moment(y).add(1, 'hours').toDate(), message: x.message, completed: true, taskType:'redue', _id: x._id};
						completedDates.push(oldTask);
					});
				}
				// if the redue is on the correct path.
				const beforeCompletes = (x.totalCompletes < x.afterCompletes);
				if (moment().isSame(date, 'month')){
					if (beforeCompletes && (start_date.isAfter(moment(date)) || start_date.isSame(moment(date), 'day'))) {
						x.start_date = start_date;
						x.end_date = start_date.add(x.taskDuration, 'hours');
					}else if (beforeCompletes && moment(date).isAfter(start_date)){
						const start_date = moment(date).set({h: moment(x.start_date).hour(), m: moment(x.start_date).minute()});
						x.start_date = start_date;
						x.overdue = true;
						x.end_date = start_date.add(x.taskDuration, 'hours');
					}
				}
				else if (beforeCompletes && start_date.isAfter(moment(date).startOf('month'))){
					x.start_date = start_date;
					x.end_date = start_date.add(x.taskDuration, 'hours');
				}
				completedDates.push(x);
				allRedueTasks.push(...completedDates);
				return;
			}
			}
		}
	});
	fullCal.push(...allRedueTasks);
};

module.exports = {
	repeats,
	redues
};
