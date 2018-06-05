import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import {withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { initCal, clearRepeats} from '../../actions/calendarActions';
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
		const slotStartState = moment(slotInfo.start);
		const slotEndState = moment(slotInfo.end).add(2, 'hours');
		this.setState({showComponent: 'AddTask', slotStartState, slotEndState});
	}
	onCancelTask(){
		this.props.clearRepeats();
		this.setState({showComponent: 'BigCalendar'});
	}
	renderContent() {
		if (this.state.showComponent === 'BigCalendar') {
			return (
				<BigCalendar
					popup
					selectable
					events={this.props.calendar.events ? this.props.calendar.events : []}
					setartAccessor="start"
					endAccessor="end"
					titleAccessor="message"
					defaultDate={new Date()}
					onSelectEvent={event => this.handleSelectEvent(event)}
					onSelectSlot={slotInfo => this.handleSlotEvent(slotInfo)}
				/>
			);
		}else if (this.state.showComponent === 'AddTask'){
			return (
				<AddTask onCancel={() => this.onCancelTask()} startDate={this.state.slotStartState} endDate={this.state.slotEndState}/>
			);
		}
	}
	render() {
		return <div className="container-fluid calendar">{this.renderContent()}</div>;
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}

export default withRouter(
	connect(mapStateToProps, { initCal ,clearRepeats })(CalendarSystem)
);
