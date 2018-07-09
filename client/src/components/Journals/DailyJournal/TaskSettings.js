import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
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
			note,
			index,
			start_date,
			completed
		} = this.props.notes.task[0];
		console.log(this.props.notes.task);
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

const mapDispatchToProps = dispatch => ({});

export default connect(
	mapStateToProps,
	actions
)(TaskSettings);
