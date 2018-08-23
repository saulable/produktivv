import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/calendarActions';
import TextareaAutosize from 'react-autosize-textarea';
import ProjectAutoSuggest from './ProjectAutoSuggest';
import Repeat from './Repeat';
import Redue from './Redue';
import Duration from './Duration';

import moment from 'moment';

import StartRepeatDate from './StartRepeatDate';
import EndRepeatDate from './EndRepeatDate';

class AddTask extends Component {
	constructor(props) {
		super(props);
		this.taskChange = this.taskChange.bind(this);
	}

	taskChange(e) {
		e.preventDefault();
		this.props.setTaskMessage({ message: e.target.value });
	}
	renderDate = () => {
		return (
			<div>
				<div className="startTimes">
					<StartRepeatDate />
				</div>
				<div className="startTimes end">
					<EndRepeatDate />
				</div>
			</div>
		);
	};
	renderDuration = () => {
		return <Duration />;
	};
	handleSubmit = async e => {
		e.preventDefault();
		const { startDate, endDate } = this.props.calendar;
		const startDateFormat = moment(startDate).format('MMMM Do YYYY, h:mm');
		const endDateFormat = moment(endDate)
			.format('MMMM Do YYYY, h:mm');
		const rdxStore = this.props.calendar;
		await this.props.quickTaskMessage({
			start_date: startDateFormat,
			end_date: endDateFormat,
			rdxStore
		});
		await this.props.setCalendarView('BigCalendar');
		await this.props.clearRepeats();
	};

	render() {
		return (
			<div className="flexFix">
				<div className="dailyCalendarContainer">
					<div className="card">
						<div className="sortHead">
							<div onClick={() => this.props.setCalendarView('BigCalendar')} className="newTask">
								&times;
							</div>
							<div className="task-box">
								<TextareaAutosize
									name="task"
									placeholder="Add task"
									onChange={this.taskChange}
									value={this.props.calendar.message}
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
										onChange={this.props.handleTracksChange}
										id="track"
										placeholder="Choose Track"
										value={this.props.calendar.track}
									/>
								</div>
								<div className="col-4">
									<div className="hat-heading">
										<ProjectAutoSuggest
											onChange={this.props.handleHatsChange}
											id="hat"
											placeholder="Choose Hat"
											value={this.props.calendar.hat}
										/>
									</div>
								</div>
								<div className="col-4">
									<div className="hat-heading">
										<ProjectAutoSuggest
											onChange={this.props.handleAutoJournal}
											id="journal"
											placeholder="Choose Journal"
											value={this.props.calendar.journal}
										/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-4 task-details">
									<div className="task-details-header">
										<span>Task Details:</span>
									</div>
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
											onChange={this.props.handleNoteChange}
											value={this.props.calendar.note}
										/>
									</div>
								</div>
								<div className="col-4">
									<Repeat />
								</div>
								<div className="col-4">
									<Redue />
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
