import React, { Component } from 'react';
import LeftNavigation from '../../containers/LeftNavigation';
import CalendarSystem from './CalendarSystem';

class DailyCalendar extends Component {
	render() {
		return (
			<div className="wrapper">
				<LeftNavigation/>
				<CalendarSystem />
			</div>
		);
	}
}
export default DailyCalendar;
