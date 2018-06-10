import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
const daysArr = [
	{ day: 'Monday', label: 'M' },
	{ day: 'Tuesday', label: 'T' },
	{ day: 'Wednesday', label: 'W' },
	{ day: 'Thursday', label: 'T' },
	{ day: 'Friday', label: 'F' },
	{ day: 'Saturday', label: 'S' },
	{ day: 'Sunday', label: 'S' }
];

class taskDays extends Component {
	constructor(props) {
		super(props);
		this.state = {
			daysSelected: []
		};
	}
	days() {
		let {daysSelected} = this.props;

		return _.map(daysArr, ({ day, label }) => {
			const isDayClicked = _.includes(daysSelected, day);
			return (
				<button
					onClick={this.props.handleDayClick}
					data-id={day}
					key={day}
					type="button"
					className={classnames('btn btn-secondary', {
						'clicked': isDayClicked
					})}
				>
					{label}
				</button>
			);
		});
	}

	render() {
		return <div>{this.days()}</div>;
	}
}

export default taskDays;
// if the state has index of the day, then it is active.
