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
	handleCal = e => {
		this.setState({ endsOnDate: e });
	};

	handleCompletes = e => {
		this.setState({ afterCompletes: e.target.value });
	};
	handleRepeatRadio = e => {
		this.setState({ activeRepeatRadio: e.currentTarget.dataset.name });
	};

	updateRadioState = e => {
		const name = e.currentTarget.dataset.tag;
	};
	taskChange = e => {
		e.preventDefault();
		const { value } = e.target;
		this.setState({ message: value });
	};
	renderDate = () => {
		let { startDate, endDate } = this.props;
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
	handleTracksChange = (trackId, value) => {
		this.setState({ [trackId]: value });
	};
	handleHatsChange = (hatId, value) => {
		this.setState({ [hatId]: value });
	};
	handleAutoJournal = (journalId, value) => {
		this.setState({ [journalId]: value });
	};
	handleNoteChange = e => {
		e.preventDefault();
		const { value } = e.target;
		this.setState({ note: value });
	};
	handleSubmit = async e => {
		// do some validation
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
	renderDuration() {
		let { startDate, endDate } = this.props;
		const duration = moment(endDate).diff(moment(startDate), 'hours');
		return <span>Duration: {duration} hours </span>;
	}
	handleMonthTime = e => {
		e.preventDefault();
		const { name } = e.currentTarget.dataset;
		if (this.state.timePlural) {
			this.setState({ timeInterval: name + 's', repeatDropdown: false });
		} else {
			this.setState({ timeInterval: name, repeatDropdown: false });
		}
	};
	changeTime = e => {
		e.preventDefault();
		if (e.target.value > 1) {
			if (this.state.timePlural) {
				this.setState({ repeatTime: e.target.value });
			} else {
				this.setState({
					repeatTime: e.target.value,
					timePlural: true,
					timeInterval: this.state.timeInterval + 's'
				});
			}
		} else if (this.state.timePlural) {
			// it's one and timeplural is true, remove the s
			this.setState({
				timeInterval: this.state.timeInterval.slice(0, -1),
				timePlural: false,
				repeatTime: e.target.value
			});
		} else {
			// else its one and time plural is false
			this.setState({ repeatTime: e.target.value });
		}
	};

	handleRepeatDropdown = e => {
		this.setState({ repeatDropdown: !this.state.repeatDropdown });
	};
	handleRedueCompletes = e => {
		this.setState({ redueCompletes: e.target.value });
	};
	redueDaysChange = e => {
		e.preventDefault();
		this.setState({ redueDays: e.currentTarget.value });
	};
	handleDayClick = e => {
		const day = e.currentTarget.dataset.id;
		const data = this.state.daysSelected;
		const index = this.state.daysSelected.indexOf(day);
		if (_.includes(data, day)) {
			this.setState({
				daysSelected: [...data.slice(0, index), ...data.slice(index + 1)]
			});
		} else {
			this.setState({ daysSelected: [...this.state.daysSelected, day] });
		}
	};
	render() {
		return (
			<div>
				<div className="dailyCalendarContainer">
					<div className="card">
						<div className="card-header">New Task</div>
						<div className="task-box">
							<TextareaAutosize
								name="task"
								placeholder="untitled task"
								onChange={this.taskChange}
								value={this.state.taskMessage}
								style={{ padding: '2px, 10px' }}
							/>
						</div>
						<div className="task-box-below">
							<div className="row">
								<div className="col-4">
									<span className="tasksHead project-head">Tracks:</span>
									<ProjectAutoSuggest
										onChange={this.handleTracksChange}
										id="track"
									/>
								</div>
								<div className="col-4">
									<div className="hat-heading">
										<span className="tasksHead">Hat: </span>
										<ProjectAutoSuggest
											onChange={this.handleHatsChange}
											id="hat"
										/>
									</div>
								</div>
								<div className="col-4">
									<div className="hat-heading">
										<span className="tasksHead">Journal: </span>
										<ProjectAutoSuggest
											onChange={this.handleAutoJournal}
											id="journal"
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
							<div className="row bottomButtons">
								<div>
									<button
										className="float-left btn btn-outline-warning"
										onClick={this.props.onCancel}
									>
										Cancel
									</button>
								</div>
								<div>
									<button
										className="float-right btn btn-outline-secondary"
										onClick={this.handleSubmit}
									>
										Submit Task
									</button>
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
