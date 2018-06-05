import React from 'react';
import _ from 'lodash';
const daysArr = [
	{ day: 'Monday', label: 'M' },
	{ day: 'Tuesday', label: 'T' },
	{ day: 'Wednesday', label: 'W' },
	{ day: 'Thursday', label: 'T' },
	{ day: 'Friday', label: 'F' },
	{ day: 'Saturday', label: 'S' },
	{ day: 'Sunday', label: 'S' }
];

export const taskDays = _.map(daysArr, ({ day, label }) => {
	return (
		<button key={day} type="button" className="btn btn-secondary">
			{label}
		</button>
	);
});
