import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as actions from '../../../actions/taskActions';

class DailyRightSideBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0
		};
	}
	journalChange(e) {
		e.preventDefault();
		const { value, name } = e.target;
		const id = e.currentTarget.dataset.id;
		this.props.handleJournalChange({ data: value });
		this.autoSave(value, id, name);
	}
	showDailyJournal(e) {
		e.preventDefault();
	}
	noteChange(e) {
		e.preventDefault();
		const { value, name } = e.target;
		const id = e.currentTarget.dataset.id;
		this.props.handleNoteChange({ data: value, id });
		this.autoSave(value, id, name);
	}

	renderTaskSettings() {
		const { taskSettings } = this.props.notes;
		if (taskSettings) {
			return (
				<div
					onClick={() => this.props.helperPop('tsettings')}
					className="settings-button"
				>
					<div className="settings-image" />
					<span>Task Settings</span>
				</div>
			);
		}
	}
	renderContent() {
		const { tab, taskSettings } = this.props.notes;
		if (!tab) {
			return (
				<div className="daily-buttons">
					<div
						onClick={() => this.props.helperPop('journal')}
						className="journal-button"
					>
						<div className="journal-image" />
						<span>Daily Journal</span>
					</div>
					{this.renderTaskSettings()}
				</div>
			);
		}
	}
	render() {
		return <div>{this.renderContent()}</div>;
	}
}

function mapStateToProps({ notes }) {
	return { notes };
}

const mapDispatchToProps = dispatch => ({});

export default connect(
	mapStateToProps,
	actions
)(DailyRightSideBar);
