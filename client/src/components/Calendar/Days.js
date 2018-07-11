import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import {handleDayClick} from '../../actions/calendarActions';
import {connect} from 'react-redux';
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
	days() {
		let {daysSelected} = this.props.calendar;

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

function mapStateToProps({calendar}){
	return {calendar};
}

export default connect(mapStateToProps, {handleDayClick})(taskDays);
// if the state has index of the day, then it is active.
