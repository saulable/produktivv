import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/calendarActions';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import AddTask from './AddTask';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class CalendarSystem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showComponent: 'BigCalendar',
			slotStartState: '',
			slotEndState: ''
		};
	}
	componentDidMount() {
		this.props.initCal();
		this.props.clearRepeats();
	}
	handleSelectEvent(event) {
		alert(event.start);
	}
	handleSlotEvent(slotInfo) {
		const nowHours = moment().hour();
		const nowMinutes = moment().minutes();
		const slotStartState = moment(slotInfo.start);
		// set the current slot time to now
		slotStartState.set({ h: nowHours, m: nowMinutes });
		const slotEndState = moment(slotStartState).add(1, 'hours');
		this.props.setTimes({ slotStartState, slotEndState});
		this.setState({ showComponent: 'AddTask', slotStartState, slotEndState });
	}
	onCancelTask() {
		this.setState({ showComponent: 'BigCalendar' });
		this.props.clearRepeats();
	}
	onNavigate = e => {
		this.props.initCal(e);
	};
	renderContent() {
		if (this.state.showComponent === 'BigCalendar') {
			return (
				<BigCalendar
					popup
					selectable
					events={this.props.calendar.events}
					setartAccessor="start"
					endAccessor="end"
					titleAccessor="message"
					defaultDate={new Date()}
					onSelectEvent={event => this.handleSelectEvent(event)}
					onSelectSlot={slotInfo => this.handleSlotEvent(slotInfo)}
					onNavigate={this.onNavigate}
				/>
			);
		} else if (this.state.showComponent === 'AddTask') {
			return <AddTask onCancel={() => this.onCancelTask()} />;
		}
	}
	render() {
		return <div className="content-x calendar">{this.renderContent()}</div>;
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(CalendarSystem)
);
