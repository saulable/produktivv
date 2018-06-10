import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/calendarActions';
import TextareaAutosize from 'react-autosize-textarea';
import ProjectAutoSuggest from './ProjectAutoSuggest';
import Repeat from './Repeat';
import Redue from './Redue';


import moment from 'moment';


class AddTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			track: '',
			hat:'',
			journal: '',
			note: ''
		};
	}
	taskChange = (e) => {
		e.preventDefault();
		const { value } = e.target;
		this.setState({message: value});
	}
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
	}
	handleTracksChange = (trackId, value) =>{
		this.setState({[trackId] : value});
	}
	handleHatsChange = (hatId, value) =>{
		this.setState({[hatId] : value} );
	}
	handleAutoJournal = (journalId, value) =>{
		this.setState({[journalId]: value});
	}
	handleNoteChange = (e) =>{
		e.preventDefault();
		const { value } = e.target;
		this.setState({note: value});
	}
	handleSubmit = async (e) =>{
		// do some validation
		e.preventDefault();
		let { startDate, endDate } = this.props;
		startDate = moment(startDate).format('MMMM Do YYYY, h:mm');
		endDate = moment(endDate).add(1, 'hours').format('MMMM Do YYYY, h:mm');
		await this.props.quickTaskMessage({...this.state, start_date: startDate, end_date: endDate});
		await this.props.onCancel();
	}
	renderDuration() {
		let { startDate, endDate } = this.props;
		const duration = moment(endDate).diff(moment(startDate), 'hours');
		return <span>Duration: {duration} hours </span>;
	}
	render() {
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
								value={this.state.taskMessage}
								style={{ padding: '2px, 10px' }}
							/>
						</div>
						<div className="task-box-below">
							<div className="row">
								<div className="col-4">
									<span className="tasksHead project-head">Tracks:</span>
									<ProjectAutoSuggest onChange={this.handleTracksChange} id="track"/>
									<div className="hat-heading">
										<span className="tasksHead">Hat: </span>
										<ProjectAutoSuggest onChange={this.handleHatsChange} id="hat" />
									</div>
									<div className="hat-heading">
										<span className="tasksHead">Journal: </span>
										<ProjectAutoSuggest onChange={this.handleAutoJournal} id="journal"/>
									</div>
								</div>
								<div className="col-4">
									<span>Task Details:</span>
									<div className="date-box">
										{this.renderDate()}
										{this.renderDuration()}
										<Repeat startDate={this.props.startDate} repeatEvery={this.props.startDate} endDate={this.props.endDate}/>
										<Redue />
									</div>
								</div>
								<div className="col-4 notes-heading">
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
							<button
								className="float-left btn btn-outline-warning"
								onClick={this.props.onCancel}
							>
								Cancel
							</button>
							<button
								className="float-right btn btn-outline-secondary"
								onClick={this.handleSubmit}
							>
								Submit Task
							</button>
						</div>
							<div>{JSON.stringify(this.state)}</div>
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
