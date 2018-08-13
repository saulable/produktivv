const moment = require('moment');

function dailyRepeatNever({ start_date, message, repeatTime, _id, taskDuration, datesCompleted }, date) {
	let startLoopDay, endLoopDay;
	// console.log(start_date);
	if (moment(start_date).startOf('day').isBefore(moment(date).startOf('month'))) {
		startLoopDay = moment(date).startOf('month');
		endLoopDay = moment(date).endOf('month');
	} else {
		startLoopDay = moment(start_date);
		endLoopDay = moment(start_date).endOf('month');
	}
	let arr = [];
	for (	let m = startLoopDay; m.isBefore(endLoopDay); m.add(repeatTime, 'days')) {
		// we skip the first day.
		const dateC = new Date(m.clone()).getTime();
		if ( datesCompleted.includes(dateC) ) {
			arr.push({ start_date: m.clone().toDate(),end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat', completed: true});
		}else {
			arr.push({ start_date: m.clone().toDate(),end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat', completed: false});
		}
	}
	return arr;
}
const dailyRepeatEnds = ({ start_date, endsOnDate, message, repeatTime, _id, taskDuration, datesCompleted }, date) => {
	let endLoopDay, startLoopDay;
	if (moment(endsOnDate).isSame(moment(date), 'month')) {
		endLoopDay = moment(endsOnDate);
		startLoopDay = moment(date).startOf('month');
	}else if (moment(start_date).isSame(moment(date), 'month')) {
		startLoopDay = moment(start_date);
		endLoopDay = moment(start_date).endOf('month');
	} else if (moment(start_date).isBefore(moment(date).startOf('month'))){
		endLoopDay = moment(date).endOf('month');
		startLoopDay = moment(date).startOf('month');
	}
	// const endLoopDay = moment(endsOnDate).endOf('month');
	let arr = [];
	for ( let m = startLoopDay; m.isBefore(endLoopDay); m.add(repeatTime, 'days')) {
		// we skip the first day.
		const dateC = new Date(m.clone()).getTime();
		if ( datesCompleted.includes(dateC) ) {
			arr.push({start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat' , completed: true});
		}
		else {
			arr.push({start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat' , completed: false});
		}
	}
	return arr;
};
const dailyRepeatCompletes = ({start_date, endsOnDate, message, repeatTime, totalCompletes, lastCompleted, afterCompletes, taskDuration, _id, datesCompleted}, date ) => {
	let startLoopDay;
	// if there are no last completes
	// we need to work on the part where we update the completes - or give user option to set?
	(lastCompleted === null ) ? startLoopDay = moment(start_date).startOf('day') : startLoopDay = moment(lastCompleted).startOf('day');
	const endLoopDay = moment(startLoopDay).add( afterCompletes * repeatTime,'days' );
	let arr = [];
	for ( let m = startLoopDay; m.isBefore(endLoopDay); m.add(repeatTime, 'days')) {
		// we skip the first day.
		const dateC = new Date(m.clone()).getTime();
		if ( datesCompleted.includes(dateC) ) {
			arr.push({ start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat', completed: true});
		}	else {
			arr.push({ start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat', completed: false});
		}
	}
	return arr;
};

let dailyArr = ({init1week,m,daysSelected,message,afterCompletes,counter, _id, taskDuration, datesCompleted}) => {
	// we cycle through 7 days, checking each day if it is inside the daysSelected array.
	let start = m.clone();
	let end = m.clone().add(7, 'days');
	const arr = [];
	// loop through each day between the dates we set in the parent function.
	for (let m = moment(start); m.isBefore(end); m.add(1, 'days')) {
		// if we hit total completes, return the array
		// or if we hit the end of the month, return the array.
		if (counter === afterCompletes) {return arr;}
		// if the day exists in the array of days selected.
		if (daysSelected.indexOf(m.format('dddd')) !== -1) {
			// skip the first entry
			if(!m.isSame(init1week[0].start_date, 'day')){
				const dateC = new Date(m.clone()).getTime();
				if ( datesCompleted.includes(dateC) ) {
					arr.push({start_date: m.clone().toDate(),end_date: m.clone().add(taskDuration, 'hours').toDate(),message, _id, taskType: 'repeat', completed: true});
				}else {
					arr.push({start_date: m.clone().toDate(),end_date: m.clone().add(taskDuration, 'hours').toDate(),message, _id, taskType: 'repeat', completed: false});
				}
				counter += 1;
				// if ( m.clone().format('D') === m.clone().endOf('month').format('D')) {return arr;}
			}
		}
	}
	return arr;
};
const weeklyRepeatNever = ({ start_date, end_date, message, repeatTime, daysSelected, taskDuration, _id, datesCompleted },date) => {
	let startLoopDay;
	let endLoopDay;
	// if the task start_date is before the passed in month, we set the start to loop from start.
	if (moment(start_date).isSame(date, 'month')) {
		startLoopDay = moment(start_date);
		endLoopDay = moment(date).endOf('month');
	} else {
		// else we loop from the last occurence of the previous month.
		const dayOf = moment(start_date).day();
		const startCheck = moment(date).day(dayOf);
		if (startCheck.isSame(date)){
			startLoopDay = moment(date).day(dayOf);
		}else {
			//TODO needs to check that the start date is from within the month range.
			startLoopDay = moment(date).day(dayOf);
		}
		endLoopDay = moment(date).endOf('month');
	}
	let arr = [];
	// if there are no days selected, then loop from startday to endloopday adding all the dates.
	for (let m = moment(startLoopDay);m.isBefore(endLoopDay); m.add(repeatTime, 'weeks')) {
		const dateC = new Date(m.clone()).getTime();
		if ( datesCompleted.includes(dateC) ){
			arr.push({start_date: new Date(m.clone()),end_date: new Date(m.clone().add(taskDuration, 'hours')), message, _id, taskType: 'repeat', completed: true});
		} else {
			arr.push({start_date: new Date(m.clone()),end_date: new Date(m.clone().add(taskDuration, 'hours')), message, _id, taskType: 'repeat', completed: false});
		}
	}
	return arr;
};

const weeklyRepeatNeverDays = ({ start_date, end_date, message, repeatTime, daysSelected, _id , datesCompleted },date ) => {
	let startLoopDay;
	let endLoopDay;
	if (moment(start_date).isSame(date, 'month')) {
		startLoopDay = moment(start_date);
		endLoopDay = moment(date).endOf('month');
	} else {
		// else we loop from the start of the month.
		startLoopDay = moment(date).startOf('month');
		endLoopDay = moment(date).endOf('month');
	}
	// otherwise there are days selected.
	let init1week = [];
	// add the initial date.
	// check that it's the same month. otherwise, get the initial startdate + 1 month
	if (moment(start_date).isSame(date, 'month')) {
		init1week.push({
			start_date: moment(startLoopDay).toDate(),
			end_date: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message,
			_id,
			taskType: 'repeat'
		});
	} else {
		init1week.push({
			start_date: moment(startLoopDay)
				.add(1, 'month')
				.toDate(),
			end_date: moment(startLoopDay)
				.add(1, 'hours')
				.toDate(),
			message,
			_id,
			taskType: 'repeat'
		});
	}
	let counter = 1;
	// loop through from start of month to end of month, cycling through each day checking if it matches a day in daysSelected, then pushing to the array.
	for (let m = moment(startLoopDay);m.isBefore(endLoopDay);m.add(repeatTime, 'weeks')) {
		const val = dailyArr({init1week, m, daysSelected, message, _id, counter, datesCompleted});
		init1week.push(...val);
	}
	return init1week;
};

const weeklyRepeatEnds = ({ start_date, end_date, endsOnDate, message, repeatTime, daysSelected, _id, datesCompleted },date) => {
	let startLoopDay;
	let endLoopDay;
	if (moment(start_date).isBefore(moment(date))) {
		startLoopDay = moment(date).startOf('month');
		if (moment(endsOnDate).isBefore(moment(date).endOf('month'))) {
			endLoopDay = moment(endsOnDate);
		} else {
			endLoopDay = moment(date).endOf('month');
		}
	} else {
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
				message,
				_id
			});
		}
		return arr;
	} else {
		let init1week = [];
		init1week.push({
			start_date: moment(startLoopDay).toDate(),
			end_date: moment(startLoopDay).toDate(),
			message,
			_id,
			taskType: 'repeat'
		});
		let counter = 1;
		for (let m = moment(startLoopDay).clone(); m < endLoopDay; m.add(repeatTime, 'weeks')) {
			const val = dailyArr({init1week, m, daysSelected, message, counter, datesCompleted});
			init1week.push(...val);
		}
		return init1week;
	}
};

const weeklyRepeatCompletes = ({start_date,lastCompleted,end_date,endsOnDate,message,repeatTime,daysSelected,afterCompletes, _id, taskDuration, datesCompleted}, date) => {
	let startLoopDay;
	if (lastCompleted === null && moment(start_date).isSame(date, 'month')) { startLoopDay = moment(start_date);}
	else {
		// we need to work on the part where we update the completes - or give user option to set?
		// i.e do we update from when the last task was completed or base it on occurences. right now it's based on last completed date.
		// startLoopDay = moment(lastCompleted).startOf('day');
		let start_dateFind = moment(start_date);
		let lastMonth = moment(date).subtract(1, 'months').endOf('month');
		while(start_dateFind.isBefore(lastMonth)){
			start_dateFind.add(repeatTime, 'weeks');
		}
		// startLoopDay = moment(date).startOf('month');
		startLoopDay = start_dateFind;
		if (daysSelected.length > 0 ){
			startLoopDay = moment(start_date);
		}
	}
	const endLoopDay = moment(startLoopDay).endOf('month');
	const realOccursDate = moment(start_date).add(afterCompletes, 'weeks');
	const totalOccurs = moment(realOccursDate).diff(startLoopDay, 'weeks');
	let arr = [];
	let count = totalOccurs;
	// if there are no days selected, we just repeat till end of month each week.
	if (daysSelected.length === 0) {
		for (let m = moment(startLoopDay); m.isBefore(startLoopDay.endOf('month'));	m.add(repeatTime, 'weeks')) {
			// if (count === afterCompletes) { return arr; }
			if (count === 0){ return arr;}
			// wrong date values, but keep it for now.
			arr.push({ start_date: new Date(m.clone()), end_date: new Date(m.clone().add(taskDuration,'hours')), message, _id, taskType: 'repeat' });
			count -= 1;
		}
		return arr;
	} else {
		let init1week = [];
		let thisMonth = [];
		init1week.push({ start_date: moment(start_date).toDate(), end_date: moment(end_date).toDate(), message, _id, taskType: 'repeat'});
		let counter = 1;
		for ( let m = moment(startLoopDay); m.isBefore(realOccursDate); m.add(repeatTime, 'weeks')) {
			const val = dailyArr(init1week,m,daysSelected, message, afterCompletes, counter, _id, taskDuration);
			counter += val.length;
			init1week.push(...val);
			if (counter === afterCompletes) {	break; }
		}
		init1week.map((x)=> {
			if (moment(x.start_date).isSame(date, 'month')){
				thisMonth.push(x);
			}
		});
		return thisMonth;
	}
};

const monthlyRepeatNever = ({start_date,end_date, message,repeatTime,monthChoice, nthdayMonth, taskDuration, _id}, date) => {
	let arr = [];
	switch(monthChoice){
	case 'noDays':{
		for ( let m = moment(start_date).startOf('day'); m.isBefore(moment(date).endOf('month')); m.add(repeatTime, 'months')){
			arr.push({ start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat'});
		}
		return arr;
	}
	case 'nthDay': {
		const curDay = moment(start_date);
		let dayOfWeek = moment(date).startOf('month').day(curDay.day());
		if (dayOfWeek.month() !== moment(date).month()){
			dayOfWeek.add(1, 'week');
		}
		const newDate = dayOfWeek.add((nthdayMonth -1), 'weeks');
		const diffTime = newDate.clone().startOf('month').diff(moment(curDay).startOf('month'), 'months');
		if (newDate.isSame(moment(date), 'month') && (diffTime % repeatTime) === 0) {
			const start_date = dayOfWeek.set({hour: curDay.hour(), minute: curDay.minute()}).toDate();
			const end_date = moment(start_date).add(taskDuration, 'hours').toDate();
			arr.push({ start_date, end_date, message, _id, taskType: 'repeat'});
		}
		return arr;
	}
	}
};

const monthlyRepeatEnds = ({start_date,end_date, message,repeatTime,monthChoice, nthdayMonth, endsOnDate, taskDuration, _id}, date) => {
	let arr = [];
	const endLoopDay = moment(endsOnDate);
	switch(monthChoice){
	case 'noDays': {
		for ( let m = moment(start_date).startOf('day'); m.isBefore(endLoopDay); m.add(repeatTime, 'months')){
			arr.push({ start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat'});
		}
		return arr;
	}
	// case 'nthDay': {
	// 	const curDay = moment(start_date);
	// 	let dayOfWeek = moment(date).startOf('month').day(curDay.day());
	// 	if (dayOfWeek.month() !== moment(date).month()){
	// 		dayOfWeek.add(1, 'week');
	// 	}
	// 	const newDate = dayOfWeek.add((nthdayMonth -1), 'weeks');
	// 	if (newDate.isSame(moment(date), 'month') && newDate.isBefore(moment(endsOnDate))) {
	// 		const start_date = dayOfWeek.set({hour: curDay.hour(), minute: curDay.minute()}).toDate();
	// 		const end_date = moment(start_date).add(taskDuration, 'hours').toDate();
	// 		arr.push({ start_date, end_date, message, _id, taskType: 'repeat'});
	// 	}
	// 	return arr;
	// }
	case 'nthDay': {
		const curDay = moment(start_date);
		// loop through and gather all the occurences of the task.
		for ( let m = moment(start_date).startOf('day'); m.isBefore(endLoopDay); m.add(repeatTime, 'months')){
			let dayOfWeek = m.startOf('month').day(curDay.day());
			if (dayOfWeek.month() !== moment(date).month()){
				dayOfWeek.add(1, 'week');
			}
			// find the date of the occurence.
			const newDate = dayOfWeek.add((nthdayMonth -1), 'weeks');
			const start_date = newDate.set({hour: curDay.hour(), minute: curDay.minute()}).toDate();
			const end_date = moment(start_date).add(taskDuration, 'hours').toDate();
			arr.push({ start_date, end_date, message, _id, taskType: 'repeat'});
		}
		return arr;
	}
	}
};
const monthlyRepeatCompletes= ({start_date,end_date, message,repeatTime,monthChoice, nthdayMonth, afterCompletes, endsOnDate, taskDuration, _id}, date) => {
	let arr = [];
	const endLoopDay = moment(start_date).add((repeatTime * afterCompletes), 'months');
	switch(monthChoice){
	case 'noDays': {
		for ( let m = moment(start_date).startOf('day'); m.isBefore(endLoopDay); m.add(repeatTime, 'months')){
			arr.push({ start_date: m.clone().toDate(), end_date: m.clone().add(taskDuration, 'hours').toDate(), message, _id, taskType: 'repeat'});
		}
		return arr;
	}
	case 'nthDay': {
		// TODO implentation - bit jerky when rendering - needs work on the endloopdate.
		const curDay = moment(start_date);
		// loop through and gather all the occurences of the task.
		for ( let m = moment(start_date).startOf('day'); m.isBefore(endLoopDay); m.add(repeatTime, 'months')){
			let dayOfWeek = m.startOf('month').day(curDay.day());
			if (dayOfWeek.month() !== moment(date).month()){
				dayOfWeek.add(1, 'week');
			}
			// find the date of the occurence.
			const newDate = dayOfWeek.add((nthdayMonth -1), 'weeks');
			const start_date = newDate.set({hour: curDay.hour(), minute: curDay.minute()}).toDate();
			const end_date = moment(start_date).add(taskDuration, 'hours').toDate();
			arr.push({ start_date, end_date, message, _id, taskType: 'repeat'});
		}
		return arr;
	}
	}
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
