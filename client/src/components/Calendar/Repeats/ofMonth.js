import React, { Component } from 'react';
import { connect } from 'react-redux';
import { nthOccurenceTask } from '../../../actions/calendarActions';
import moment from 'moment';

class ofMonth extends Component {
	componentDidMount() {
		const curDay = moment(this.props.startDate);
		var monday = moment(this.props.startDate)
			.startOf('month')
			.day(curDay.day());
		if (monday.date() > 7) monday.add(7, 'd');
		const month = monday.month();
		let totalOccur = 0;
		while (month === monday.month() && monday.date() <= curDay.date()) {
			totalOccur += 1;
			monday.add(7, 'd');
		}
		this.props.nthOccurenceTask(totalOccur);
	}
	addNth = n => {
		return ['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th';
	};
	render() {
		return (
			<div>
				On the {this.props.calendar.nthdayMonth}
				{this.addNth(this.props.calendar.nthdayMonth)} {this.props.startDate.format('ddd')} of every month
			</div>
		);
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}
export default connect(mapStateToProps, { nthOccurenceTask })(ofMonth);
