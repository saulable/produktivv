import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/taskActions';

class TaskSettings extends Component {
	constructor(props) {
		super(props);
		this.handleClose = this.handleClose.bind(this);
	}
	handleClose(e) {
		e.preventDefault();
		this.props.helperPop(null);
	}
	renderTaskSettings() {
		const {
			message,
		} = this.props.notes.task[0];
		return (
			<div className="settingsWrap">
				<div className="title">{message}</div>
				<div className="notes-box" />
			</div>
		);
	}
	render() {
		return (
			<div className="taskSettings">
				<div className="taskHeader">
					<span>Task Settings</span>
					<a onClick={this.handleClose} className="close">
						&times;
					</a>
				</div>
				<div className="settingsArea">{this.renderTaskSettings()}</div>
			</div>
		);
	}
}

function mapStateToProps({ notes }) {
	return { notes };
}
export default connect(
	mapStateToProps,
	actions
)(TaskSettings);
