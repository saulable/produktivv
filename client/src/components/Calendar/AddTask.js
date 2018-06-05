import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/calendarActions';
import TextareaAutosize from 'react-autosize-textarea';
import ProjectAutoSuggest from './ProjectAutoSuggest';
import _ from 'lodash';
import classnames from 'classnames';
import Repeat from './Repeat';
import Redue from './Redue';

import { taskDays } from './Days.js';

import moment from 'moment';


class AddTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			taskMesssageAdd: '',
			showRedue: true
		};
		this.taskChange = this.taskChange.bind(this);
	}
	taskChange(e) {
		e.preventDefault();
		const { value } = e.target;
		this.props.quickTaskMessage(value);
	}
	renderDate() {
		let { startDate, endDate } = this.props;
		startDate = moment(startDate).format('MMMM Do YYYY, h:mm');
		endDate = moment(endDate).format('MMMM Do YYYY, h:mm');
		return (
			<div>
				<span>Start: {startDate}</span>
				<br />
				<span>End: {endDate}</span>
				<br />
			</div>
		);
	}
	renderDuration() {
		let { startDate, endDate } = this.props;
		const duration = moment(endDate).diff(moment(startDate), 'hours');
		return <span>Duration: {duration} hours </span>;
	}
	render() {
		const { taskMessage } = this.props;
		return (
			<div>
				<div className="container-fluid">
					<div className="card">
						<div className="card-header">New Task</div>
						<div className="task-box">
							<TextareaAutosize
								name="task"
								placeholder="untitled task"
								onChange={this.taskChange}
								value={taskMessage}
								style={{ padding: '2px, 10px' }}
							/>
						</div>
						<div className="task-box-below">
							<div className="row">
								<div className="col-4">
									<span className="tasksHead project-head">Tracks:</span>
									<ProjectAutoSuggest />
									<div className="hat-heading">
										<span className="tasksHead">Hat: </span>
										<ProjectAutoSuggest />
									</div>
									<div className="hat-heading">
										<span className="tasksHead">Journal: </span>
										<ProjectAutoSuggest />
									</div>
								</div>
								<div className="col-4">
									<span>Task Details:</span>
									<div className="date-box">
										{this.renderDate()}
										{this.renderDuration()}
										<Repeat />
										<Redue />
									</div>
								</div>
								<div className="col-4 notes-heading">
									<div>
										<span className="tasksHead">Notes:</span>
									</div>
									<TextareaAutosize />
								</div>
							</div>
							<button
								className="float-left btn btn-outline-warning"
								onClick={this.props.onCancel}
							>
								Cancel
							</button>
							<button
								className="float-right btn btn-outline-secondary"
								onClick={() => this.props.history.push('/home')}
							>
								Submit Task
							</button>
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
export default connect(mapStateToProps, actions)(withRouter(AddTask));
