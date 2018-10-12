import React, { Component } from 'react';
import TextFieldGroup from '../../../containers/TextFieldGroup';
import DailyTasksList from './DailyTasksList';
import DailyRightSideBar from './DailyRightSideBar';
import DailyJournalText from './DailyJournalText';

import TaskSettings from './TaskSettings';
import { connect } from 'react-redux';
import * as actions from '../../../actions/taskActions';

class Entries extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			note: '',
			notes_show: true,
			journal: '',
			name: '',
			typing: false,
			typingTimeOut: 0
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		e.preventDefault();
		this.props.newTaskRequest(this.state, this.props.tasks.date).then(res => {
			this.setState({ message: '' });
		});
	}
	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	setWrapperRef(node) {
		this.wrapperRef = node;
	}
	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.props.offTaskClick();
		}
	}
	render() {
		return (
			<div className="wrapper journal-content">
				<div className="container-fluid">
					<div className="row">
						<div className="input-box col-12">
							<form onSubmit={this.onSubmit} className="tasks">
								<TextFieldGroup
									field="message"
									label="Daily Task"
									placeholder="Enter your daily task here"
									onChange={this.onChange}
									value={this.state.message}
								/>
							</form>
						</div>
					</div>
					<div className="row tasks-notes" ref={this.setWrapperRef}>
						<div className="must-complete">
							<DailyTasksList
								taskList={this.props.taskList}
							/>
							{this.props.notes.tab === 'journal' ? <DailyJournalText /> : null}
							{this.props.notes.tab === 'tsettings' ? <TaskSettings /> : null}
						</div>
						<DailyRightSideBar />
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ notes, tasks }) {
	return { notes, tasks };
}

export default connect(
	mapStateToProps,
	actions
)(Entries);
