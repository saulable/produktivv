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

class StartRepeatDate extends Component {
	constructor(props) {
		super(props);
		this.handleHours = this.handleHours.bind(this);
		this.handleMinutes = this.handleMinutes.bind(this);
		this.handleStartFrom = this.handleStartFrom.bind(this);
	}
	renderHoursInput() {
		let { startDate } = this.props.calendar;
		startDate = moment(startDate).set({
			h: this.props.calendar.startTimeHours
		});
		return startDate.format('HH');
	}
	renderMinutesInput() {
		let { startDate } = this.props.calendar;
		startDate = moment(startDate).set({
			m: this.props.calendar.startTimeMinutes
		});
		return startDate.format('mm');
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
	renderTimeInput() {
		let { startDate } = this.props.calendar;
		startDate = moment(startDate).format('h:mm');
		return <input placeholder={startDate} onChange={this.changeDate} />;
	}
	handleHours(e) {
		const nowHours = e.target.value;
		if (e.target.value >= 0 && e.target.value < 24) {
			this.props.startTimePickerHours(nowHours);
		}
	}
	handleMinutes(e) {
		const nowMinutes = e.target.value;
		if (e.target.value >= 0 && e.target.value < 60) {
			this.props.startTimePickerMins(nowMinutes);
		}
	}
	handleStartFrom(selectedDay, modifiers) {
		if (selectedDay !== undefined) {
			console.log(selectedDay);
			const startDate = moment(selectedDay).set({
				h: this.props.calendar.startTimeHours,
				m: this.props.calendar.startTimeMinutes
			}).toDate();
			console.log(startDate);
			this.props.handleStartFrom(startDate);
		}
	}
	render() {
		return (
			<div className="editTimes">
				<span className="title">Start:</span>
				<DayPickerInput
					value={new Date(this.props.calendar.startDate)}
					selectedDay={new Date(this.props.calendar.startDate)}
					keepFocus={false}
					formatDate={formatDate}
					parseDate={parseDate}
					format="L"
					onDayChange={this.handleStartFrom}
					placeholder={`${formatDate(
						new Date(this.props.calendar.startDate),
						'L',
						'en-gb'
					)}`}
					dayPickerProps={{
						locale: 'en-gb',
						localeUtils: MomentLocaleUtils
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
)(StartRepeatDate);
