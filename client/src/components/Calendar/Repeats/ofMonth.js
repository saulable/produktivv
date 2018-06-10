import React from 'react';
import moment from 'moment';

const ofMonth = ({startDate, endDate}) => {
	const curDay = moment(startDate);
	var monday = moment(startDate)
		.startOf('month')
		.day(curDay.day());
	if (monday.date() > 7) monday.add(7, 'd');
	const month = monday.month();
	let totalOccur = 0;
	while (month === monday.month() && monday.date() <= curDay.date()) {
		totalOccur += 1;
		monday.add(7, 'd');
	}
	const addNth = n => {
		return ['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th';
	};
	return (
		<div>
			On the {totalOccur}{addNth(totalOccur)} {startDate.format('ddd')} of every
			month
		</div>
	);
};

export default ofMonth;
