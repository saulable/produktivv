import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/calendarActions';
import TextareaAutosize from 'react-autosize-textarea';
import ProjectAutoSuggest from './ProjectAutoSuggest';
import Repeat from './Repeat';
import Redue from './Redue';
import _ from 'lodash';

import moment from 'moment';

class AddTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			track: '',
			hat: '',
			journal: '',
			note: '',
			timeInterval: 'week',
			timePlural: false,
			repeatTime: '1',
			monthlyRepeat: 'noDays',
			monthlyBoth: false,
			repeatDropdown: false,
			redueCompletes: '1',
			redueDays: '1',
			daysSelected: [],
			endsOnDate: '',
			afterCompletes: '',
			activeRepeatRadio: 'never'
		};
	}
	// don't think I need this?
	updateRadioState = e => {
		const name = e.currentTarget.dataset.tag;
	};
	renderDate = () => {
		let { startDate, endDate } = this.props.calendar;
		startDate = moment(startDate).format('ddd Do MMMM YYYY, h:mm');
		endDate = moment(endDate).format('ddd Do MMMM YYYY, h:mm');
		return (
			<div>
				<span>Start: {startDate}</span>
				<br />
				<span>End: {endDate}</span>
				<br />
			</div>
		);
	};
	renderDuration = () => {
		let { startDate, endDate } = this.props.calendar;
		const duration = moment(endDate).diff(moment(startDate), 'hours');
		return <span>Duration: {duration} hours </span>;
	};
	handleSubmit = async e => {
		e.preventDefault();
		let { startDate, endDate } = this.props;
		startDate = moment(startDate).format('MMMM Do YYYY, h:mm');
		endDate = moment(endDate)
			.add(1, 'hours')
			.format('MMMM Do YYYY, h:mm');
		const rdxStore = this.props.calendar;
		await this.props.quickTaskMessage({
			...this.state,
			start_date: startDate,
			end_date: endDate,
			rdxStore
		});
		await this.props.onCancel();
	};

	render() {
		return (
			<div>
				<div className="dailyCalendarContainer">
					<div className="card">
						<div className="sortHead">
							<div onClick={this.props.onCancel} className="newTask">
								&times;
							</div>
							<div className="task-box">
								<TextareaAutosize
									name="task"
									placeholder="Add task"
									onChange={this.taskChange}
									value={this.state.taskMessage}
									style={{
										height: '40px',
										resize: 'none'
									}}
								/>
							</div>
							<div className="btn" onClick={this.handleSubmit}>
								Add New Task
							</div>
						</div>
						<div className="task-box-below">
							<div className="row">
								<div className="col-4">
									<ProjectAutoSuggest
										onChange={this.handleTracksChange}
										id="track"
										placeholder="Choose Track"
									/>
								</div>
								<div className="col-4">
									<div className="hat-heading">
										<ProjectAutoSuggest
											onChange={this.handleHatsChange}
											id="hat"
											placeholder="Choose Hat"
										/>
									</div>
								</div>
								<div className="col-4">
									<div className="hat-heading">
										<ProjectAutoSuggest
											onChange={this.handleAutoJournal}
											id="journal"
											placeholder="Choose Journal"
										/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-4 task-details">
									<span>Task Details:</span>
									<div className="date-box">
										{this.renderDate()}
										{this.renderDuration()}
									</div>
									<div className="notes-heading">
										<div>
											<span className="tasksHead">Notes:</span>
										</div>
										<TextareaAutosize
											id="note"
											onChange={this.handleNoteChange}
											value={this.state.note}
										/>
									</div>
								</div>
								<div className="col-4">
									<Repeat
										startDate={this.props.startDate}
										endDate={this.props.endDate}
										handleMonthTime={this.handleMonthTime}
										changeTime={this.changeTime}
										timeInterval={this.state.timeInterval}
										timePlural={this.state.timePlural}
										repeatTime={this.state.repeatTime}
										clickMonth={this.clickMonth}
										monthlyRepeat={this.state.monthlyRepeat}
										monthlyBoth={this.state.monthlyBoth}
										handleRepeatDropdown={this.handleRepeatDropdown}
										repeatDropdown={this.state.repeatDropdown}
										completesValue={this.state.redueCompletes}
										handleDayClick={this.handleDayClick}
										daysSelected={this.state.daysSelected}
										handleCal={this.handleCal}
										handleCompletes={this.handleCompletes}
										handleRepeatRadio={this.handleRepeatRadio}
										completesValue={this.state.afterCompletes}
										activeRepeatRadio={this.state.activeRepeatRadio}
									/>
								</div>
								<div className="col-4">
									<Redue
										startDate={this.props.startDate}
										endDate={this.props.endDate}
										handleCompletes={this.handleRedueCompletes}
										redueDaysChange={this.redueDaysChange}
										redueDays={this.state.redueDays}
									/>
								</div>
							</div>
						</div>
					</div>
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
)(withRouter(AddTask));
