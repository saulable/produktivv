import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/calendarActions';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Toolbar from 'react-big-calendar/lib/Toolbar';
import AddTask from './AddTask';
import CustomEvent from './CustomEvent';

import DayJournal from './DayJournal';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class CustomToolbar extends Toolbar{
	constructor(props){
		super(props);
		this.viewNamesGroup = this.viewNamesGroup.bind(this);
	}
	render(){
		return (
			<div className='rbc-toolbar'>
				<button className="todayButton" type="button" onClick={() => this.navigate('TODAY')} >Today</button>
				<span className="rbc-btn-group">
					<button className="fa fa-arrow-left" type="button" onClick={() => this.navigate('PREV')}></button>
					<button className="fa fa-arrow-right" type="button" onClick={() => this.navigate('NEXT')}></button>
				</span>
				<span className="rbc-toolbar-label">{this.props.label}</span>
				<span className="rbc-btn-group">
					{this.viewNamesGroup({month: 'month', week: 'week', day: 'day'})}
				</span>
			</div>
		);
	}
}

class CalendarSystem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showComponent: 'BigCalendar',
			slotStartState: '',
			slotEndState: '',
			currentMonth: ''
		};
	}
	componentDidMount() {
		this.props.initCal();
		this.props.clearRepeats();
		this.setState({currentMonth: Date.now()});
	}
	handleSlotEvent(slotInfo) {
		const nowHours = moment().hour();
		const nowMinutes = moment().minutes();
		const slotStartState = moment(slotInfo.start);
		// set the current slot time to now
		slotStartState.set({ h: nowHours, m: nowMinutes });
		const slotEndState = moment(slotStartState).add(1, 'hours');
		this.props.setTimes({ slotStartState, slotEndState });
		this.setState({ showComponent: 'AddTask', slotStartState, slotEndState });
	}
	onCancelTask() {
		this.setState({ showComponent: 'BigCalendar' });
		this.props.clearRepeats();
	}
	onNavigate = e => {
		if (!moment(this.state.currentMonth).isSame(moment(e), 'month')){
			this.setState({currentMonth: e});
			this.props.initCal(e);
		}
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
					onSelectSlot={slotInfo => this.handleSlotEvent(slotInfo)}
					onNavigate={this.onNavigate}
					views={{
						month: true,
						week: true,
						day: DayJournal,
					}}
					components={{
						toolbar: CustomToolbar,
						month:{
							event: CustomEvent
						}
					}}
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
