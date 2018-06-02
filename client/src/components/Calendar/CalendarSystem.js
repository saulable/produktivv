import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import {connect} from 'react-redux';
import {init_cal} from '../actions/calendarActions';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class CalendarSystem extends Component {
	componentDidMount(){
		this.props.init_cal();
	}
	render() {
		return (
			<div className="container-fluid calendar">
				<BigCalendar
					events={[]}
					setartAccessor="startDate"
					endAccessor="endDate"
				/>
			</div>
		);
	}
}

function mapStateToProps({calendar}){
	return calendar;
}

export default connect(mapStateToProps, {init_cal})(CalendarSystem);
