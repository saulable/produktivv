import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { connect } from 'react-redux';
import * as actions from '../../actions/calendarActions';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';

import MomentLocaleUtils, {
	formatDate,
	parseDate
} from 'react-day-picker/moment';

import 'moment/locale/en-gb';

class EndRepeatDate extends Component {
	constructor(props) {
		super(props);
		this.handleHours = this.handleHours.bind(this);
		this.handleMinutes = this.handleMinutes.bind(this);
		this.handleEndTo = this.handleEndTo.bind(this);
	}
	renderDateInput() {
		let { startDate } = this.props.calendar;
		startDate = moment(startDate).format('DD/MM/YYYY');
		return (
			<input
				className="dateInput"
				placeholder={startDate}
				onChange={this.changeDate}
			/>
		);
	}
	renderHoursInput() {
		let { endDate } = this.props.calendar;
		endDate = moment(endDate).set({ h: this.props.calendar.endTimeHours });
		return endDate.format('HH');
	}
	renderMinutesInput() {
		let { endDate } = this.props.calendar;
		endDate = moment(endDate).set({ m: this.props.calendar.endTimeMinutes });
		return endDate.format('mm');
	}
	handleHours(e) {
		const nowHours = e.target.value;
		// const startHours = this.props.calendar.startTimeHours;
		if (e.target.value >= 0 && e.target.value < 24) {
			this.props.endTimePickerHours(nowHours);
		}
	}
	handleMinutes(e) {
		const nowMinutes = e.target.value;
		if (e.target.value >= 0 && e.target.value < 60) {
			this.props.endTimePickerMins(nowMinutes);
		}
	}
	handleEndTo(selectedDay, mods) {
		if (selectedDay !== undefined) {
			const endDate = moment(selectedDay).set({
				h: this.props.calendar.endTimeHours,
				m: this.props.calendar.endTimeMinutes
			}).toDate();
			this.props.handleEndTo(endDate);
		}
	}
	render() {
		return (
			<div className="editTimes">
				<span className="title">End:</span>
				<DayPickerInput
					value={new Date(this.props.calendar.endDate)}
					selectedDay={new Date(this.props.calendar.startDate)}
					formatDate={formatDate}
					parseDate={parseDate}
					format="L"
					onDayChange={this.handleEndTo}
					placeholder={`${formatDate(
						new Date(this.props.calendar.startDate),
						'L',
						'en-gb'
					)}`}
					dayPickerProps={{
						locale: 'en-gb',
						localeUtils: MomentLocaleUtils,
						disabledDays: { before: new Date(this.props.calendar.startDate) }
					}}
				/>
				<span>@</span>
				<div className="timePicker">
					<input
						onChange={this.handleHours}
						value={this.renderHoursInput()}
						className="hours"
					/>
					<span>:</span>
					<input
						onChange={this.handleMinutes}
						value={this.renderMinutesInput()}
						className="minutes"
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}
export default connect(
	mapStateToProps,
	actions
)(EndRepeatDate);
